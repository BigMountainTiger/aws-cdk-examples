const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const codeartifact = require('@aws-cdk/aws-codeartifact');

class CodeArtifactCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const DOMAIN_NAME = 'experimental-domain';
    const REPO_NAME = 'experimental-repository';
    const USERGROUP_NAME = 'experiment-code-artifact-user-group';

    const MINIMAL_ALLOWED_ACTIONS = [
      'codeartifact:GetAuthorizationToken',
      'codeartifact:ReadFromRepository',
      'codeartifact:PublishPackageVersion'
    ];

    const domain = new codeartifact.CfnDomain(this, `${id}-domain`, {
      domainName: DOMAIN_NAME
    });

    domain.permissionsPolicyDocument = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: MINIMAL_ALLOWED_ACTIONS,
          principals: [
            new iam.ArnPrincipal('arn:aws:iam::537548412289:root')
          ]
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: MINIMAL_ALLOWED_ACTIONS,
          principals: [
            new iam.ArnPrincipal('arn:aws:iam::123129172005:root')
          ]
        })
      ]
    });

    const repository = new codeartifact.CfnRepository(this, `${id}-repository`, {
      domainName: DOMAIN_NAME,
      repositoryName: REPO_NAME,
      description: REPO_NAME,
    })

    repository.node.addDependency(domain);

    const permissionGroup = new iam.Group(this, `${id}-permission-group`, {
      groupName: USERGROUP_NAME,
    });

    permissionGroup.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['sts:GetServiceBearerToken']
    }));

    permissionGroup.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: MINIMAL_ALLOWED_ACTIONS
    }));
  }
}

module.exports = { CodeArtifactCdkStack }
