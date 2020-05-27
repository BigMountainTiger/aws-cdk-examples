// https://stackoverflow.com/questions/58346357/asynchronous-cursor-execution-in-snowflake

const sf = require('snowflake-sdk');
const exit = () => {
  console.log('Exit the program ...');
  process.exit(0);
};

(async() => {

  const cn = sf.createConnection( {
    account: 'account',
    username: 'user',
    password: 'Bullshit',
    database: 'database',
    schema: 'public',
    warehouse: 'COMPUTE_WH'
  });

  const connection_promise = new Promise((rs, rj) => {
    cn.connect((err, cn) => {
      if (err) { rj(err); } else { rs(cn); }
    })
  });

  await connection_promise;

  const query = `ALTER TASK Load_Data_Task RESUME;`;
  const execute_promise = new Promise((rs, rj) => {
    cn.execute({ sqlText: query, complete: (err, stmt) => {
      if (err) {
        rj(err)
      } else {
        rs(`Successfully executed statement:\n ${stmt.getSqlText()}`);
      }
    }});
  });

  const result = await execute_promise;
  console.log(result);

  // const query = `COPY INTO DATA_INTEGRATIONS.Loan FROM @MLG_SNOWFLAKE_STAGE/Loan.txt FILE_FORMAT = (TYPE = csv FIELD_DELIMITER = '|' SKIP_HEADER = 1) ON_ERROR = CONTINUE;`;
  // cn.execute({ sqlText: query });

  //exit();
  // const destroy_promise = new Promise((rs, rj) => {
  //   cn.destroy((err, cn) => {
  //     if (err) { rj(err); } else { rs('Disconnected connection with id: ' + cn.getId()); }
  //   })
  // });

  // const result = await destroy_promise;
  // console.log(result);
})();

console.log('Started ...');