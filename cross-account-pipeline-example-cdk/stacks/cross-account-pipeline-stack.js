const cdk = require('@aws-cdk/core');
const codebuild = require('@aws-cdk/aws-codebuild');
const codecommit = require('@aws-cdk/aws-codecommit');
const codepipeline = require('@aws-cdk/aws-codepipeline');
const codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
const iam = require('@aws-cdk/aws-iam');

class CrossAccountPipelineStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const account = '537548412289-ABCD';

    const REPOSITORY_NAME = 'cross-account-pipeline-example';
    const repository = codecommit.Repository.fromRepositoryName(this, 'ImportedRepo', REPOSITORY_NAME);
    const sourceOutput = new codepipeline.Artifact();
    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');

    const cloudformation_role = iam.Role.fromRoleArn(this,
      "cloudformation_role", `arn:aws:iam::${account}:role/SONG_Test_CF_Role`, { mutable: false });

    const deployment_role = iam.Role.fromRoleArn(this,
      "deployment_role", `arn:aws:iam::${account}:role/SONG_Test_Role`, { mutable: false });

    const cdkBuild = new codebuild.PipelineProject(this, 'CdkBuild', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: { commands: ['npm install -g aws-cdk', 'npm install'] },
          build: { commands: ['cdk synth -o dist'] }
        },
        artifacts: {
          'base-directory': 'dist',
          files: ['CROSS-ACCOUNT-PIPELINE-EXAMPLE-STACK.template.json']
        }
      }),
      environment: { buildImage: codebuild.LinuxBuildImage.STANDARD_2_0 }
    });

    const PIPELINE_NAME = `${id}-PIPELINE`;
    const pipeline = new codepipeline.Pipeline(this, PIPELINE_NAME, {
      pipelineName: PIPELINE_NAME,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: 'CodeCommit_Source',
              repository: repository,
              output: sourceOutput
            })
          ]
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'CDK_Build',
              project: cdkBuild,
              input: sourceOutput,
              outputs: [cdkBuildOutput]
            })
          ]
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.CloudFormationCreateUpdateStackAction({
              actionName: 'Pipeline_Deploy',
              templatePath: cdkBuildOutput.atPath('CROSS-ACCOUNT-PIPELINE-EXAMPLE-STACK.template.json'),
              stackName: 'CROSS-ACCOUNT-PIPELINE-EXAMPLE-STACK',
              capabilities: ['CAPABILITY_IAM'],
              adminPermissions: true,
              account: account,
              deploymentRole: cloudformation_role,
              role: deployment_role
            })
          ]
        }
      ]
    });

    const policyStatement = new iam.PolicyStatement();
    policyStatement.addResources([`arn:aws:iam::${account}:role/*`]);
    policyStatement.addActions(["sts:AssumeRole"]);

    pipeline.addToRolePolicy(policyStatement);
  }
}

module.exports = { CrossAccountPipelineStack }