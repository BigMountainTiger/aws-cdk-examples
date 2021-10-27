const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');

class LayerCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const add_lambda_role = () => {
      const NAME = 'ALayeredFunctionRole'
      const role = new iam.Role(this, NAME, {
        roleName: NAME,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['arn:aws:sqs:*'],
        actions: ['sqs:DeleteMessage', 'sqs:GetQueueAttributes', 'sqs:ReceiveMessage']
      }))

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
      }))

      return role;
    };

    const add_lambda_layer = () => {
      const NAME = `ALayeredFunctionNodeModuleLayer`;

      return new lambda.LayerVersion(this, NAME, {
        layerVersionName: NAME,
        code: lambda.Code.fromAsset('./layer/a-layered-function-node-module-layer'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
        description: 'A Layered Function Node_Module Layer'
      });
    };

    const add_lambda = (layer, role) => {
      const NAME = `ALayeredFunction`;

      return new lambda.Function(this, NAME, {
        runtime: lambda.Runtime.NODEJS_12_X,
        functionName: NAME,
        role: role,
        code: lambda.Code.asset('./lambda/a-layered-function'),
        layers: [layer],
        handler: 'index.handler'
      });
    };

    const role = add_lambda_role();
    const layer = add_lambda_layer();
    add_lambda(layer, role);
  }
}

module.exports = { LayerCdkStack }
