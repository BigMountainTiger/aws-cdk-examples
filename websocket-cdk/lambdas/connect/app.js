// Example code
// https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/

exports.lambdaHandler = async (event, context) => {
  
  console.log(event);
  
  return {
    statusCode: 200,
    body: JSON.stringify(event)
  };
  
};