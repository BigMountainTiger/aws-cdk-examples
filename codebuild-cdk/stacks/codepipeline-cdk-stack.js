// https://docs.aws.amazon.com/cdk/api/latest/docs/aws-codebuild-readme.html

require('dotenv').config();

const cdk = require('@aws-cdk/core');
const codebuild = require('@aws-cdk/aws-codebuild');
const codepipeline = require('@aws-cdk/aws-codepipeline');
const codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');

class CodepipelineCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const PIPELINENAME = `${id}-PIPELINE`;

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const OWNER = 'BigMountainTiger';
    const REPOSITORY_NAME_1 = 'aws-codepipeline-example';
    const REPOSITORY_NAME_2 = 'python-excercise';

    const sourceOutput_1 = new codepipeline.Artifact('sourceOutput_1');
    const sourceOutput_2 = new codepipeline.Artifact('sourceOutput_2');

    const STEP1_NAME = `${PIPELINENAME}-STEP-1`;
    const step1 = new codebuild.PipelineProject(this, STEP1_NAME, {
      projectName: STEP1_NAME,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [`echo "STEP 1"`, 'ls -la']
          }
        }
      }),
      environment: codebuild.LinuxBuildImage.STANDARD_4_0
    });

    const STEP2_NAME = `${PIPELINENAME}-STEP-2`;
    const step2 = new codebuild.PipelineProject(this, STEP2_NAME, {
      projectName: STEP2_NAME,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [`echo "STEP 2"`, 'ls -la']
          }
        }
      }),
      environment: codebuild.LinuxBuildImage.STANDARD_4_0
    });

    new codepipeline.Pipeline(this, PIPELINENAME, {
      pipelineName: PIPELINENAME,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              actionName: 'Github_Source_1',
              oauthToken: cdk.SecretValue.plainText(GITHUB_TOKEN),
              owner: OWNER,
              repo: REPOSITORY_NAME_1,
              trigger: codepipeline_actions.GitHubTrigger.NONE,
              output: sourceOutput_1
            }),
            new codepipeline_actions.GitHubSourceAction({
              actionName: 'Github_Source_2',
              oauthToken: cdk.SecretValue.plainText(GITHUB_TOKEN),
              owner: OWNER,
              repo: REPOSITORY_NAME_2,
              trigger: codepipeline_actions.GitHubTrigger.NONE,
              output: sourceOutput_2
            })
          ]
        },
        {
          stageName: 'Step_1',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'PIPELINE_STEP_1_ACTION_1',
              project: step1,
              input: sourceOutput_1
            }),
            new codepipeline_actions.CodeBuildAction({
              actionName: 'PIPELINE_STEP_1_ACTION_2',
              project: step2,
              input: sourceOutput_2
            })
          ]
        },
        {
          stageName: 'Step_2',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'PIPELINE_STEP_2',
              project: step2,
              input: sourceOutput_2
            })
          ]
        }
      ]
    });
    
  }
}

module.exports = { CodepipelineCdkStack }
