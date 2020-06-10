exports.lambdaHandler = async (event, context) => {
  const result = 'OK';
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(result)
  };
};