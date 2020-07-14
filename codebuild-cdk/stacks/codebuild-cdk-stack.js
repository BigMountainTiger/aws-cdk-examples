// https://docs.aws.amazon.com/cdk/api/latest/docs/aws-codebuild-readme.html

const cdk = require('@aws-cdk/core');
const codebuild = require('@aws-cdk/aws-codebuild');

class CodebuildCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const projectName = `${id}-MY-PROJECT`;
    new codebuild.Project(this, projectName, {
      projectName: projectName,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'ls -la',
              'pwd',
              'cat /etc/lsb-release'
            ]
          }
        }
      }),
      environment: codebuild.LinuxBuildImage.STANDARD_4_0
    });
    
  }
}

module.exports = { CodebuildCdkStack }
