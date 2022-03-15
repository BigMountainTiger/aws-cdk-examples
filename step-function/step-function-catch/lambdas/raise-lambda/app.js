exports.lambdaHandler = async (event, context) => {

  console.log(event);

  return {
    text: JSON.stringify(event)
  };
};