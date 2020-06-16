-- https://docs.snowflake.com/en/sql-reference/sql/create-procedure.html
-- LANGUAGE JAVASCRIPT
-- Specifies that the stored procedure contains JavaScript code. Currently,
-- JavaScript is the only language supported; specifying any other language will result in an error message.

-- Load_Table
CREATE or REPLACE PROCEDURE LOAD_Table(TABLE_NAME VARCHAR)
RETURNS VARCHAR NOT NULL
LANGUAGE javascript
AS
$$
    let result = 'SUCCESS';

    const table_name = TABLE_NAME;

    const task_name = `LOAD_${table_name}_Task`;
    const full_table_name = `DATA_INTEGRATIONS.${table_name}`;
    const file_name = `${table_name}.txt`;

    
    const skip = 1;
    const st = snowflake.createStatement;
    const statements = [
        `ALTER TASK IF EXISTS ${task_name} SUSPEND;`,
        `TRUNCATE TABLE ${full_table_name};`,
        `COPY INTO ${full_table_name} FROM @MLG_SNOWFLAKE_STAGE/${file_name}
          FILE_FORMAT = (TYPE = csv FIELD_DELIMITER = '|' SKIP_HEADER = ${skip}) ON_ERROR = CONTINUE`
    ];
    
    statements.forEach(s => {
        st({sqlText: s}).execute();
    });
    
    return result;
$$;


-- Create_Load_Task
CREATE or REPLACE PROCEDURE Create_Load_Task(TABLE_NAME VARCHAR)
RETURNS VARCHAR NOT NULL
LANGUAGE javascript
AS
$$
    let result = 'SUCCESS';
    const table_name = TABLE_NAME;
    const warehouse = 'COMPUTE_WH';

    const query = `CREATE OR REPLACE TASK Load_${table_name}_Task
      WAREHOUSE = ${warehouse}
      SCHEDULE = 'USING CRON * * * * * UTC'
      AS CALL LOAD_Table('${table_name}');`;
    
    snowflake.createStatement({ sqlText: query }).execute();
    
    return result;
$$;