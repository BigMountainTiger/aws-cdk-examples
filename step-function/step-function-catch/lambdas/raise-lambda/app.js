exports.lambdaHandler = async (event, context) => {

  console.log(event);

  if (event.Comment != 'Insert your JSON here') {
    throw 'An artificial exception thrown from here';
  }

  return {
    text: JSON.stringify(event)
  };
};