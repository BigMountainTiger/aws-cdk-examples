const cdk = require('@aws-cdk/core');
const apigateway = require('@aws-cdk/aws-apigateway');

class WebsocketCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const API_NAME = `${id}-WEBSOCKET-API`;
    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_NAME,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });
    
    
  }
}

module.exports = { WebsocketCdkStack }
