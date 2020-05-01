const cdk = require('@aws-cdk/core');
const codecommit = require('@aws-cdk/aws-codecommit');

class RepositoryCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const ID = id;
    const REPOSITORY_NAME = `${ID}Repository`;

    const add_repository = () => {
      const repo = new codecommit.Repository(this, REPOSITORY_NAME ,{
        repositoryName: REPOSITORY_NAME,
        description: 'This is a test repository.'
      });

      return repo;
    };

    add_repository();

  }
}

module.exports = { RepositoryCdkStack }
