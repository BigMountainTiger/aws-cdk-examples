const fs = require('fs');
const aws = require('aws-sdk');
const lambda = new aws.Lambda({ region: 'us-east-1' });

const lambda_name = 'DOCKER-Lambda-CDK-STACK-PDF';

(async () => {

  const input_file = './files/result.docx';
  const output_file = './files/result.pdf';

  const input = fs.readFileSync(input_file);
  const input_base64 = input.toString('base64');

  const payload = {
    Payload: input_base64
  };

  const result = await lambda.invoke({
    FunctionName: lambda_name,
    Payload: JSON.stringify(payload)
  }).promise();

  const result_json = JSON.parse(result.Payload);
  fs.writeFileSync(output_file, Buffer.from(result_json.Payload, 'base64'))

})();

