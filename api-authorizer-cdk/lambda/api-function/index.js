exports.handler = async (event, context) => {

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" },
    body: 'OK - from the API'
  };
};