const snowflake_command = require('snowflake-command');

const get_file_list = (event) => {

  const files = [];
  const records = event.Records || [];

  records.forEach((record) => {
    const body = JSON.parse(record.body || '{}');
    const s3_records = body.Records || [];

    s3_records.forEach((s3_record) => {
      const s3 = s3_record.s3 || {};
      const s3_object = s3.object || {};
      const s3_object_key = s3_object.key;

      if (s3_object_key) {
        files.push(s3_object_key);
      }
    });
    
  })

  return files;
};

const get_query_list = (files) => {

  const queries = [];
  files.forEach((file) => {
    const filename = file.includes('.')
      ? file.split('.').slice(0, -1).join('.').trim() : file.trim();

    console.log(filename);
  });

  return queries;
};

exports.lambdaHandler = async (event, context) => {

  const files = get_file_list(event);
  const queries = get_query_list(files);

  // const query = `ALTER TASK IF EXISTS Load_Data_Task RESUME;`;
  // await snowflake_command.issue(query);

  return {};
};