const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const CONST = require('./CONST');

require('dotenv').config();

class ApiGwBasicInfrastructureStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {

      const role = new iam.Role(this, `${id}-${CONST.LAMBDA_ROLE_NAME}`, {
        roleName: CONST.LAMBDA_ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      return role;

    })();
  }
}

module.exports = { ApiGwBasicInfrastructureStack }
