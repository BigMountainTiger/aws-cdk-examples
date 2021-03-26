const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const codeartifact = require('@aws-cdk/aws-codeartifact');

class CodeArtifactCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const DOMAIN_NAME = 'testdomain';
    const REPO_NAME = 'testnugetrepo';

    const domain = new codeartifact.CfnDomain(this, `${id}-nuget-domain`, {
      domainName: DOMAIN_NAME
    });

    const document = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: ['codeartifact:*'],
          principals: [
            new iam.ArnPrincipal('arn:aws:iam::537548412289:root')
          ]
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: ['codeartifact:*'],
          principals: [
            new iam.ArnPrincipal('arn:aws:iam::123129172005:root')
          ]
        })
      ]
    });

    domain.permissionsPolicyDocument = document;

    new codeartifact.CfnRepository(this, `${id}-nuget-repository`, {
      domainName: DOMAIN_NAME,
      repositoryName: REPO_NAME,
      description: REPO_NAME
    })
  }
}

module.exports = { CodeArtifactCdkStack }
