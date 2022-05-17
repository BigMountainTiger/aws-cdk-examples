
exports.handler = async (event, context) => {

  result = {
    comment: 'This is a example lambda'
  };

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(result)
  };
};