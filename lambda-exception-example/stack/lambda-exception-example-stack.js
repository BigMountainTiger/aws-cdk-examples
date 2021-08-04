const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');

class LambdaExceptionExampleStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}-Lambda-Role`;
    const role = (() => {
      const role = new iam.Role(this, ROLE_NAME, {
        roleName: ROLE_NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }));

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['arn:aws:s3:::*'],
        actions: ['s3:GetObject', 's3:PutObject']
      }));

      return role;
    })();

    const FUNCTION_NAME = `${id}-Lambda-Exception-Example`;
    const func = (() => {

      const path = './lambda/javascript/lambda-exception-example';
      const func = new lambda.Function(this, FUNCTION_NAME, {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName: FUNCTION_NAME,
        timeout: cdk.Duration.seconds(60),
        role: role,
        code: lambda.Code.fromAsset(path),
        handler: 'index.handler'
      });

      func.addPermission('ApiAccessPermission', {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
      })

      return func;
    })();

  }
}

module.exports = { LambdaExceptionExampleStack }
