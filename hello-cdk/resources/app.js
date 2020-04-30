
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'This is the lambda',
      status: 'OK'
    })
  };
};