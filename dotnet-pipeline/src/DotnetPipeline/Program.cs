using Amazon.CDK;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DotnetPipeline
{
    sealed class Program
    {
        public static void Main(string[] args)
        {
            var app = new App();

            new DotnetFunctionalStack(app, "DotnetFunctionalStack");
            new DotnetPipelineStack(app, "DotnetPipelineStack");
            app.Synth();
        }
    }
}
