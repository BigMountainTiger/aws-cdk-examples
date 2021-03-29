const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

class DotnetLambdaLayerCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}-Lambda_Role`;

    const add_lambda_role = () => {
      const role = new iam.Role(this, ROLE_NAME, {
        roleName: ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      return role;
    };

    const role = add_lambda_role();

  }
}

module.exports = { DotnetLambdaLayerCdkStack }
