using Amazon.CDK;
using Amazon.CDK.AWS.DynamoDB;
using Amazon.CDK.AWS.EC2;
using Amazon.CDK.AWS.ECS;
using Amazon.CDK.AWS.Lambda;
using Amazon.CDK.AWS.StepFunctions;
using Amazon.CDK.AWS.StepFunctions.Tasks;
using System;
using System.Collections.Generic;
using System.Text;

namespace PresortCdk.Resources.StepFunctions.Tasks
{
    class MergeFileFargateTaskResource
    {

        public static Amazon.CDK.AWS.StepFunctions.Tasks.EcsRunTask CreateTask(Construct scope, Table presortTable)
        {
            var environmentCID = Amazon.CDK.AWS.SSM.StringParameter.ValueFromLookup(scope, Config.PARAMETER_STORE_AWS_ACCOUNTID_CICD);

            var repo = new Amazon.CDK.AWS.ECR.Repository(scope, "ECRRepo", new Amazon.CDK.AWS.ECR.RepositoryProps()
            {
                RemovalPolicy = RemovalPolicy.DESTROY,
                RepositoryName = Config.ECR_REPO_NAME
            });

            repo.AddToResourcePolicy(new Amazon.CDK.AWS.IAM.PolicyStatement(new Amazon.CDK.AWS.IAM.PolicyStatementProps
            {
                Effect = Amazon.CDK.AWS.IAM.Effect.ALLOW,
                Actions = new string[] { "ecr:*" },
                Principals = new Amazon.CDK.AWS.IAM.IPrincipal[]
              {
                    new Amazon.CDK.AWS.IAM.ArnPrincipal("arn:aws:iam::"+environmentCID+":root")
              }
            }));


            var taskDefinition = new FargateTaskDefinition(scope, "DownloadAccuzipFileTaskDefinition", new FargateTaskDefinitionProps()
            {
                Cpu= 4096,
            MemoryLimitMiB = 8192,

            });

            var containerDefinition = taskDefinition.AddContainer(Config.ECR_REPO_NAME + "1", new ContainerDefinitionProps()
            {
                Cpu = 4096,
                MemoryLimitMiB = 8192,
                Image = ContainerImage.FromEcrRepository(repo),
                Logging = new AwsLogDriver(new AwsLogDriverProps() { StreamPrefix = "dmappresort" })

            });


            var policyStatement = new Amazon.CDK.AWS.IAM.PolicyStatement();
            policyStatement.AddAllResources();
            policyStatement.AddActions(new string[] { "dynamoDb:*", "ses:*", "s3:*" });
            taskDefinition.AddToTaskRolePolicy(policyStatement);





            var cluster = CreateCluster(scope);


            var lstEnviron = new List<TaskEnvironmentVariable>();

            //lstEnviron.Add(new TaskEnvironmentVariable
            //{
            //    Name = "accuzipFileS3key",
            //    Value = JsonPath.StringAt("$.accuzipFileS3key")
            //});

            //lstEnviron.Add(new TaskEnvironmentVariable
            //{
            //    Name = "beforeReduceFileS3Key",
            //    Value = JsonPath.StringAt("$.beforeReduceFileS3Key")
            //});


            //lstEnviron.Add(new TaskEnvironmentVariable
            //{
            //    Name = "bucketName",
            //    Value = JsonPath.StringAt("$.bucketName")
            //});

            //lstEnviron.Add(new TaskEnvironmentVariable
            //{
            //    Name = "apiKey",
            //    Value = JsonPath.StringAt("$.apiKey")
            //});

            lstEnviron.Add(new TaskEnvironmentVariable
            {
                Name = "REQUESTID",
                Value = JsonPath.StringAt("$.requestId")
            });

            lstEnviron.Add(new TaskEnvironmentVariable
            {
                Name = "DYNAMO_TABLE",
                Value = presortTable.TableName
            });






            return new EcsRunTask(scope, "FileMergeFargate", new EcsRunTaskProps()
            {
               
                LaunchTarget = new EcsFargateLaunchTarget(),
                AssignPublicIp = true,
                IntegrationPattern = IntegrationPattern.RUN_JOB,
                Cluster = cluster,
                TaskDefinition = taskDefinition,
                ContainerOverrides = (new List<ContainerOverride>
                                {
                                    new ContainerOverride
                                    {
                                        ContainerDefinition=containerDefinition,
                                        Environment=lstEnviron.ToArray()
                                   }
                                }).ToArray()

            });






        }

        public static Cluster CreateCluster(Construct scope)
        {
            var vpc = Vpc.FromLookup(scope, "MyVPC", new VpcLookupOptions()
            {
                VpcId= "vpc-00b85526a33fa6e93"
            });
            return new Cluster(scope, "DownloadAccuzipFilesCluster", new ClusterProps
            {
                ClusterName = Config.FARGATE_CLUSTER_NAME,
                Vpc = vpc
            });

        }
        public static FargateTaskDefinition CreateTaskDefinition1(Construct scope)
        {
            var repo = CreateDockerContainerImage(scope);

            var taskDefinition = new FargateTaskDefinition(scope, "DownloadAccuzipFileTaskDefinition", new FargateTaskDefinitionProps()
            {
                MemoryLimitMiB = 2048,
            });

            taskDefinition.AddContainer(Config.ECR_REPO_NAME, new ContainerDefinitionProps()
            {
                MemoryLimitMiB = 2048,
                Image = ContainerImage.FromEcrRepository(repo),
                Logging = new AwsLogDriver(new AwsLogDriverProps() { StreamPrefix = "dmappresort" })

            });



            var policyStatement = new Amazon.CDK.AWS.IAM.PolicyStatement();
            policyStatement.AddAllResources();
            policyStatement.AddActions(new string[] {   "s3:*" });
            taskDefinition.AddToTaskRolePolicy(policyStatement);


            return taskDefinition;
        }

        public static Amazon.CDK.AWS.ECR.Repository CreateDockerContainerImage(Construct scope)
        {

            var repo = new Amazon.CDK.AWS.ECR.Repository(scope, "ECRRepo", new Amazon.CDK.AWS.ECR.RepositoryProps()
            {
                RemovalPolicy = RemovalPolicy.DESTROY,
                RepositoryName = Config.ECR_REPO_NAME
            });

            repo.AddToResourcePolicy(new Amazon.CDK.AWS.IAM.PolicyStatement(new Amazon.CDK.AWS.IAM.PolicyStatementProps
            {
                Effect = Amazon.CDK.AWS.IAM.Effect.ALLOW,
                Actions = new string[] { "ecr:*" }
            }));

            return repo;

        }



    }
}
