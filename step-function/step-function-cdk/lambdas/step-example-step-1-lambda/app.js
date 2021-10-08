// STEPEXAMPLESTEP1LAMBDA549BA457

exports.lambdaHandler = async (event, context) => {

  const time = new Date().toISOString();
  return {
    Payload: { time: time }
  };
};