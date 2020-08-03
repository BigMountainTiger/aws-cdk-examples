const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

class LaunchEc2CdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const create_lambda = (id, scope) => {

      const create_role = (id, scope) => {
        const role_name = `${id}-EC2-LAUNCH-ROLE`;
        const role = new iam.Role(scope, role_name, {
          roleName: role_name,
          description: role_name,
          assumedBy: new iam.CompositePrincipal(
            new iam.ServicePrincipal('lambda.amazonaws.com'),
          )
        });
  
        role.addToPolicy(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents', 'ec2:RunInstances', 'iam:PassRole']
        }));
      };

      const role = create_role(id, scope);

      const lambda_name = `${id}-LAUNCH_EC2_LAMBDA`;
      const lambda_function = new lambda.Function(scope, lambda_name, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: lambda_name,
        description: lambda_name,
        timeout: cdk.Duration.seconds(5),
        role: role,
        code: lambda.Code.asset('./lambdas/launch-ec2-lambda'),
        memorySize: 128,
        handler: 'index.lambdaHandler'
      });

      return lambda_function;
    };

    create_lambda(id, this);
  }
}

module.exports = { LaunchEc2CdkStack }
