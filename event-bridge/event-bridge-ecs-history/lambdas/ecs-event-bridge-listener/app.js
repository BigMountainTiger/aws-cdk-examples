exports.lambdaHandler = async (event, context) => {
  console.log('event-bridge-listener is invoked');
  console.log(event);
  return context.logStreamName
};