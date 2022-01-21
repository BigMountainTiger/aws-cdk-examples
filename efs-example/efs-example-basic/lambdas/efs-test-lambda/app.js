// https://stackoverflow.com/questions/63463288/aws-lambda-efs-eacces-permission-denied

const fs = require('fs');

exports.lambdaHandler = async (event, context) => {

  const f = '/mnt/fs/data.json';

  let data = null;
  if (fs.existsSync(f)) {

    const f_data = fs.readFileSync(f, 'utf8');
    data = JSON.parse(f_data);
  } else {

    data = {
      access: 0
    };
  }

  data.access++;
  fs.writeFileSync(f, JSON.stringify(data));

  return data;
};