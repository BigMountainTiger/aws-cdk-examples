const cdk = require('@aws-cdk/core');
const codeartifact = require('@aws-cdk/aws-codeartifact');

class CodeArtifactCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const NAME = 'test-nuget-repo';
    const DOMAIN_NAME = 'test-domain';

    new codeartifact.CfnDomain(this, `${id}-nuget-domain`, {
      domainName: DOMAIN_NAME
    });

    new codeartifact.CfnRepository(this, `${id}-nuget-repository`, {
      domainName: DOMAIN_NAME,
      repositoryName: NAME,
      description: NAME
    })
  }
}

module.exports = { CodeArtifactCdkStack }
