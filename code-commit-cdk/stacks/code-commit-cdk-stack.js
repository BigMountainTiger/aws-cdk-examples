const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');

class CodeCommitCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ROLE_NAME = `${id}-EVENT_RULE_ROLE`;
    const role = new iam.Role(this, ROLE_NAME, {
      roleName: ROLE_NAME,
      description: ROLE_NAME,
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('events.amazonaws.com'),
      )
    });

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['events:PutEvents']
    }))
    
    const RULE_NAME = `${id}-EVENT_RULE`;
    new cdk.CfnResource(this, RULE_NAME, {
      type: 'AWS::Events::Rule',
      properties: {
        Name: RULE_NAME,
        Description: RULE_NAME,
        EventPattern:  {
          source: ['aws.codecommit'],
          'detail-type': ['CodeCommit Repository State Change'],
          detail: {
            referenceType: ['branch'],
            event: ['referenceCreated', 'referenceUpdated'],
            referenceName: ['master', "develop"]
          }
        },
        Targets: [{
            Id: 'Target0',
            RoleArn: role.roleArn,
            Arn: 'https://sqs.us-east-1.amazonaws.com/005256505030/Test-SQS'
        }]
      }
    });


  }
}

module.exports = { CodeCommitCdkStack }
