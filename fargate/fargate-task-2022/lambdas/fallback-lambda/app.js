exports.lambdaHandler = async (event, context) => {
  console.log('fallback-lambda is invoked');

  console.log(context);
  console.log(event);
  
  return context.logStreamName
};