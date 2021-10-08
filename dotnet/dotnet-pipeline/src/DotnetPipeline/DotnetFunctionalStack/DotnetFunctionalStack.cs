using Amazon.CDK;
using Amazon.CDK.AWS.S3;
using Amazon.CDK.AWS.Lambda;

namespace DotnetPipeline
{
    public class DotnetFunctionalStack : Stack
    {
        internal DotnetFunctionalStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            // new Bucket(this, "TestBucket", new BucketProps() {
            //   BucketName = "test.bucket.huge.head.li",
            //   RemovalPolicy = RemovalPolicy.DESTROY
            // });

            // new Bucket(this, "TestBucket1", new BucketProps() {
            //   BucketName = "test1.bucket.huge.head.li",
            //   RemovalPolicy = RemovalPolicy.DESTROY
            // });

            string FUNCTION_NAME = "MyDotNetTestFunction";
            new Function(this, FUNCTION_NAME, new FunctionProps()
            {
                Code = Code.FromAsset("src/lambdas/HelloWorld/bin/Debug/netcoreapp3.1/publish"),
                Handler = "HelloWorld::HelloWorld.Function::FunctionHandler",
                Runtime = Runtime.DOTNET_CORE_3_1,
                FunctionName = FUNCTION_NAME,
                Timeout = Duration.Seconds(60)
            });

        }
    }
}
