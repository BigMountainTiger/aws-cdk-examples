const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

class StepFunctionExampleCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const PREFIX = 'STEP_FUNCTION_EXAMPLE';

    const create_role = () => {
      const role_name = `${PREFIX}_LAMBDA_ROLE`;
      const role = new iam.Role(this, role_name, {
        roleName: role_name,
        description: role_name,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents'
        ]
      }));

      return role;
    };

    const role = create_role();
    const create_lambda = (name, path) => {
      const lambda_name = `${PREFIX}_${name}`;

      return new lambda.Function(this, lambda_name, {
        runtime: lambda.Runtime.PYTHON_3_8,
        functionName: lambda_name,
        description: lambda_name,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.asset(path),
        memorySize: 256,
        handler: 'app.lambda_handler'
      });
    };

    const sum_lambda = create_lambda('SUM_LAMBDA',
      './lambdas/sum-lambda/');
    const square_lambda = create_lambda('SQUARE_LAMBDA',
      './lambdas/square-lambda/');

  }
}

module.exports = { StepFunctionExampleCdkStack }
