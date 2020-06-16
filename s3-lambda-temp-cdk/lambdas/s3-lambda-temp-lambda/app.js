// S3LAMBDATEMPLAMBDA853AB85C

const AWS = require('aws-sdk');
const fs = require('fs');
const readline = require('readline');

const bucket = 's3-lambda-temp-bucket.huge.head.li';
const SOURCE_KEY = 'Loan.txt';

const get_s3_object = async () => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: bucket,
    Key: SOURCE_KEY
  };

  const file = await s3.getObject(params).promise();

  return file;
};

const put_s3_object = async (buffer) => {
  const s3 = new AWS.S3();
  
  const time = new Date().toISOString();
  const TARGET_KEY = time.replace(/:/g, '-').replace(/\./g, '-');

  const params = {
    Bucket: bucket,
    Key: TARGET_KEY,
    Body: buffer
  };

  const result = await s3.putObject(params).promise(); 
  return result;
};

const write_to_file = async (file_name, buffer) => {
  const write_p = new Promise((rs, rj) => {
    fs.writeFile(file_name, buffer, (err) => {
      if(err) { rj(err); } else { rs('File is saved'); }
    });
  });

  await write_p;
};

const read_file = async (file_name) => {
  const read_p = new Promise((rs, rj) => {
    fs.readFile(file_name, (err, data) => {
      if(err) { rj(err); } else { rs(data); }
    });
  });
  
  return await read_p;
};

const read_file_line_by_line = async (file_name) => {
  const fileStream = fs.createReadStream(file_name);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const buffers = [];
  for await (const line of rl) {
    const sub_line = line.split('|').slice(0, 3).join('|') + '\n';
    buffers.push(Buffer.from(sub_line));
  }

  return Buffer.concat(buffers);
};

exports.lambdaHandler = async (event, context) => {
  let result = {};

  const file = await get_s3_object();
  const buffer = file.Body || new Buffer(0);

  const file_name = '/tmp/tempfile';

  await write_to_file(file_name, buffer);

  const put_parital_file = false;
  const func = put_parital_file? read_file_line_by_line : read_file;
  const data = await func(file_name);

  result = await put_s3_object(data);

  console.log(result);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify({
      context: context,
      result: result
    })
  };
};
