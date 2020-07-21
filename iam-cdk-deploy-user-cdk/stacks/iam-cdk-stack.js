// https://docs.aws.amazon.com/cli/latest/reference/iam/create-access-key.html
// aws iam create-access-key --user-name Bob

const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');

class IamCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const userName = 'test-user'
    const user = new iam.User(this, userName, {
      userName: userName
    });

    user.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['cloudformation:*']
    }));

    user.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['*'],
      conditions: {
        'ForAnyValue:StringEquals': {
          "aws:CalledVia": [
            "cloudformation.amazonaws.com"
          ]
        }
      }
    }));

    user.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['arn:aws:s3:::cdktoolkit-stagingbucket-*'],
      actions: ['s3:*']
    }));

  }
}

module.exports = { IamCdkStack }
