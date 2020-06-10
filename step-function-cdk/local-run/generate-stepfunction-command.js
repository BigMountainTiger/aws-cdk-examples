let sfn = `{
  "StartAt": "STEP_TEST_MACHINE_STEP_1",
  "States": {
    "STEP_TEST_MACHINE_STEP_1": {
      "Next": "STEP_TEST_MACHINE_STEP_WAIT",
      "Type": "Task",
      "OutputPath": "$.Payload",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:005256505030:function:STEP_EXAMPLE_STEP_1_LAMBDA",
        "Payload.$": "$"
      }
    },
    "STEP_TEST_MACHINE_STEP_WAIT": {
      "Type": "Wait",
      "Seconds": 30,
      "Next": "STEP_TEST_MACHINE_STEP_2"
    },
    "STEP_TEST_MACHINE_STEP_2": {
      "End": true,
      "Type": "Task",
      "InputPath": "$",
      "OutputPath": "$.Payload",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:005256505030:function:STEP_PUT_S3_ENTRY_LAMBDA",
        "Payload.$": "$"
      }
    }
  },
  "TimeoutSeconds": 300
}`;

sfn = sfn.replace(/"/g, '\\"');
sfn = sfn.split('\n').join('\\\n');

let command = `aws stepfunctions --endpoint http://localhost:8083 create-state-machine --definition "${sfn}"`;
command = `${command} --name "STEP_TEST_STATE_MACHINE" --role-arn "arn:aws:iam::005256505030:role/DummyRole"`;

console.log(command);


