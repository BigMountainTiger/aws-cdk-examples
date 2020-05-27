const snowflake_command = require('snowflake-command');

exports.lambdaHandler = async (event, context) => {
  console.log(JSON.stringify(event));
  const query = `ALTER TASK IF EXISTS Load_Data_Task RESUME;`;
  await snowflake_command.issue(query);

  return {};
};