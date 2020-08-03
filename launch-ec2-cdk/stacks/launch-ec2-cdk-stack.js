const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

class LaunchEc2CdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

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
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents', 'ec2:RunInstances']
      }));
    };

    const create_lambda = (id, scope) => {
      const role = create_role(id, scope);
    };

    create_lambda(id, this);
  }
}

module.exports = { LaunchEc2CdkStack }
