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

    queries.push(`ALTER TASK IF EXISTS Load_${filename.replace(/-/g, '_')}_Task RESUME;`);
  });

  return queries;
};

exports.lambdaHandler = async (event, context) => {

  try {
    const files = get_file_list(event);
    const queries = get_query_list(files);
    await snowflake_command.issue(queries);
  } catch (ex) {
    
    console.log({ error: ex, event: JSON.stringify(event) });
  }

  return {};
};