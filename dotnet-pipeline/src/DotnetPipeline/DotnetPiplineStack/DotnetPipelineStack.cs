using Amazon.CDK;
using Amazon.CDK.AWS.CodeBuild;
using Amazon.CDK.AWS.CodeCommit;
using Amazon.CDK.AWS.CodePipeline;
using Amazon.CDK.AWS.CodePipeline.Actions;
using System.Collections.Generic;
using Amazon.CDK.AWS.IAM;

namespace DotnetPipeline
{
    public class DotnetPipelineStack : Stack
    {
        internal DotnetPipelineStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            string REPO_NAME = "dotnet-pipeline";
            string STACK_NAME = "DotnetFunctionalStack";

            var code = Repository.FromRepositoryName(this, "ImportedRepo", REPO_NAME);

            var sourceOutput = new Artifact_();

            var cdkDeploy = new PipelineProject(this, "CDKDeploy", new PipelineProjectProps
            {
              BuildSpec = BuildSpec.FromObject(new Dictionary<string, object> {
                ["version"] = "0.2",
                ["phases"] = new Dictionary<string, object>
                {
                  ["install"] = new Dictionary<string, string>
                  {
                    ["commands"] = "npm install -g aws-cdk"
                  },
                  ["build"] = new Dictionary<string, object>
                  {
                    ["commands"] = new [] { "src/scripts/build.sh", "cdk deploy " + STACK_NAME }
                  }
                }
              }),
              Environment = new BuildEnvironment { BuildImage = LinuxBuildImage.AMAZON_LINUX_2_3 }
            });

            var statement = new Amazon.CDK.AWS.IAM.PolicyStatement();
            statement.Effect = Effect.ALLOW;
            statement.AddActions(new [] {"*"});
            statement.AddAllResources();
            cdkDeploy.Role.AddToPolicy(statement);

            var pipeline = new Amazon.CDK.AWS.CodePipeline.Pipeline(this, "Pipeline", new PipelineProps {
              Stages = new [] {
                new StageProps
                {
                  StageName = "Source",
                  Actions = new []
                  {
                    new CodeCommitSourceAction(new CodeCommitSourceActionProps
                    {
                        ActionName = "Source",
                        Repository = code,
                        Output = sourceOutput
                    })
                  }
                },
                new StageProps
                {
                  StageName = "Deploy",
                  Actions = new []
                  {
                    new CodeBuildAction(new CodeBuildActionProps
                    {
                      ActionName = "CDK_Deploy",
                      Project = cdkDeploy,
                      Input = sourceOutput
                    })
                  }
                }
              }
            });
            
        }
    }
}
