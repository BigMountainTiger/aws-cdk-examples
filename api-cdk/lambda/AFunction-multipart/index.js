exports.handler = async (event, context) => {
  console.log('Received');

  console.log(event);

  const body = event.body;

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" },
    body: 'OK'
  };
};