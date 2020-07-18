// https://docs.aws.amazon.com/cdk/api/latest/docs/aws-codebuild-readme.html

const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const codebuild = require('@aws-cdk/aws-codebuild');

class CodebuildCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const projectName = `${id}-MY-PROJECT`;
    const project = new codebuild.Project(this, projectName, {
      projectName: projectName,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'ls -la',
              'pwd',
              'cat /etc/lsb-release',
              'echo $A',
              'echo "${B} world"  > abcd',
              'ls -l',
              'cat abcd'
              //'aws codepipeline start-pipeline-execution --name CODEPIPELINE-CDK-STACK-PIPELINE'
            ]
          }
        }
      }),
      environment: codebuild.LinuxBuildImage.STANDARD_4_0
    });
    
    let policyStatement = new iam.PolicyStatement();
    policyStatement.addAllResources();
    policyStatement.addActions(['*']);
    project.addToRolePolicy(policyStatement);
  }
}

module.exports = { CodebuildCdkStack }
