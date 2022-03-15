const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const sfn = require('aws-cdk-lib/aws-stepfunctions');
const tasks = require('aws-cdk-lib/aws-stepfunctions-tasks');

class StepFunctionCatchStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {
      const role_name = `${id}_Lambda_role`;
      const principal = new iam.ServicePrincipal('lambda.amazonaws.com');
      const role = new iam.Role(this, role_name, { roleName: role_name, description: role_name, assumedBy: principal });
      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW, resources: ['*'], actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents'
        ]
      }));

      return role;
    })();

    const create_lambda = (name, path) => {
      const lambda_name = `${id}_${name}`;

      return new lambda.Function(this, lambda_name, {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName: lambda_name,
        description: lambda_name,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.asset(path),
        memorySize: 128,
        handler: 'app.lambdaHandler'
      });
    };

    const raise_lambda = create_lambda('RAISE_LAMBDA', './lambdas/raise-lambda');
    const catch_lambda = create_lambda('CATCH_LAMBDA', './lambdas/catch-lambda');

  }
}

module.exports = { StepFunctionCatchStack }
