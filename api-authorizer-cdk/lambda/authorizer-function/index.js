// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html

const generatePolicy = (effect, resource) => {

  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }]
    }
  };

};

exports.handler = async (event, context) => {
  // The "event" parameter has all the information regarding to the request
  console.log(event);

  const methodArn = event.methodArn;
  const authorization = event.headers.Authorization;

  let policy = generatePolicy('Deny', methodArn);

  if (authorization === 'ALLOW') {
    policy = generatePolicy('Allow', methodArn);
  }
  
  return policy;
};