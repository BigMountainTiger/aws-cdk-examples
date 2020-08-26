const cdk = require('@aws-cdk/core');
const ecr = require('@aws-cdk/aws-ecr');

class DockerEcrCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const REPOSITORY_ID = `${id}-REPOSITORY`;
    const REPOSITORY_NAME = `experiment`;
    new ecr.Repository(this, REPOSITORY_ID, {
      repositoryName: REPOSITORY_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY
      
    })
  }
}

module.exports = { DockerEcrCdkStack }