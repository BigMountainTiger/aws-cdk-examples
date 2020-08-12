let sfn = `{
  "StartAt": "STEP_FUNCTION_EXAMPLE_STEP_1_SUM",
  "States": {
    "STEP_FUNCTION_EXAMPLE_STEP_1_SUM": {
      "Next": "STEP_FUNCTION_EXAMPLE_STEP_WAIT",
      "Type": "Task",
      "InputPath": "$",
      "OutputPath": "$.Payload",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:123456789012:function:STEP_FUNCTION_EXAMPLE_SUM_LAMBDA",
        "Payload.$": "$"
      }
    },
    "STEP_FUNCTION_EXAMPLE_STEP_WAIT": {
      "Type": "Wait",
      "Seconds": 3,
      "Next": "STEP_FUNCTION_EXAMPLE_STEP_1_SQUARE"
    },
    "STEP_FUNCTION_EXAMPLE_STEP_1_SQUARE": {
      "End": true,
      "Type": "Task",
      "InputPath": "$",
      "OutputPath": "$.Payload",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:123456789012:function:STEP_FUNCTION_EXAMPLE_SQUARE_LAMBDA",
        "Payload.$": "$"
      }
    }
  },
  "TimeoutSeconds": 300
}`;

sfn = sfn.replace(/"/g, '\\"');
sfn = sfn.split('\n').join('\\\n');

let command = `aws stepfunctions --endpoint http://localhost:8083 create-state-machine --definition "${sfn}"`;
command = `${command} --name "STEP_TEST_STATE_MACHINE" --role-arn "arn:aws:iam::123456789012:role/DummyRole"`;

console.log(command);


