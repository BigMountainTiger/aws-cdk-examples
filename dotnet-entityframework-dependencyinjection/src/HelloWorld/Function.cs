using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.SQSEvents;

using Microsoft.Extensions.DependencyInjection;
using HelloWorld.DI;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace HelloWorld
{
    public class Function
    {
        private static ServiceProvider serviceProvider = null;
        private static int callCount = 0;


        static Function() {
            
            Function.callCount++;

            var serviceCollection = new ServiceCollection();
            serviceCollection.AddSingleton<IClass1, Class1>();
            serviceCollection.AddSingleton<IClass2, Class2>();

            Function.serviceProvider = serviceCollection.BuildServiceProvider();
        }

        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {
            LambdaLogger.Log(JsonConvert.SerializeObject(apigProxyEvent));
            LambdaLogger.Log(JsonConvert.SerializeObject(context));

            var serviceProvider = Function.serviceProvider;
            var class1 = serviceProvider.GetService<IClass1>();

            var body = await Task.Run(() => {
                return new Dictionary<string, string>
                {
                    { "callCount", Function.callCount.ToString() },
                    { "message", "hello world" },
                    { "location", class1.GetMsg() }
                };
            });

            return new APIGatewayProxyResponse
            {
                Body = JsonConvert.SerializeObject(body),
                StatusCode = 200,
                Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
            };
        }
    }
}
