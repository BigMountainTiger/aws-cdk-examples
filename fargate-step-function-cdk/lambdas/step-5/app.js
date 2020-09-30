exports.lambdaHandler = async (event, context) => {

  console.log(JSON.stringify(event));
  const time = new Date().toISOString();
  return {};
};