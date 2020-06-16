-- https://docs.snowflake.com/en/sql-reference/sql/create-task.html
-- https://docs.snowflake.com/en/user-guide/tasks-intro.html#:~:text=Snowflake%20ensures%20only%20one%20instance,that%20scheduled%20time%20is%20skipped.

-- Need to grant the permission to run tasks, and
-- It is possible to increase the task timeout if needed - https://docs.snowflake.com/en/user-guide/tasks-ts.html
-- use role accountadmin;
-- grant execute task on account to role <role_name>;

-- Address
CALL Create_Load_Task('Address');

-- CorelogicData
CALL Create_Load_Task('CorelogicData');

-- Deed
CALL Create_Load_Task('Deed');

-- Lead
CALL Create_Load_Task('Lead');

-- Loan
CALL Create_Load_Task('Loan');

-- LoanDetail
CALL Create_Load_Task('LoanDetail');

-- LoanHistory
CALL Create_Load_Task('LoanHistory');

-- LoandDetailHistory
CALL Create_Load_Task('LoandDetailHistory');

-- Person
CALL Create_Load_Task('Person');

-- Property
CALL Create_Load_Task('Property');

-- UnusedData
CALL Create_Load_Task('UnusedData');