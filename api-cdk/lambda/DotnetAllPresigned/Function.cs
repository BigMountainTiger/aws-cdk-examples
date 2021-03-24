using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

using Amazon.S3;
using Amazon.S3.Model;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
namespace DotnetAllPresigned
{
    public class Function
    {
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {

            var bucket = "api-cdk.huge.head.li-1";
            var expires = DateTime.Now.AddMinutes(5);
            var fileName = apigProxyEvent.PathParameters["file_name"];

            var get_url = await Task.Run(() => {
                
                var client = new AmazonS3Client(new AmazonS3Config {
                    SignatureVersion = "s3v4"
                });

                var request = new GetPreSignedUrlRequest()
                {
                    Verb = HttpVerb.GET,
                    BucketName = bucket,
                    Key = fileName,
                    Expires = expires
                };

                return client.GetPreSignedURL(request);
            });

            var put_url = await Task.Run(() => {
                
                var client = new AmazonS3Client(new AmazonS3Config {
                    SignatureVersion = "s3v4"
                });

                var request = new GetPreSignedUrlRequest()
                {
                    Verb = HttpVerb.PUT,
                    BucketName = bucket,
                    Key = fileName,
                    Expires = expires
                };

                return client.GetPreSignedURL(request);
            });
            
            var response = new Dictionary<string, string>
            {
                { "get_url", get_url },
                { "put_url", put_url }
            };

            return new APIGatewayProxyResponse
            {
                Body = JsonConvert.SerializeObject(response),
                StatusCode = 200,
                Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
            };
        }
    }
}
