exports.lambdaHandler = async (event, context) => {

  await new Promise((rs, rj) => {

    const timeout = 10 * 1000;
    setTimeout(() => {
      rs(`Waited for ${timeout} seconds`);
    }, timeout);
  });

  const time = new Date().toISOString();
  return {
    Payload: { time: time }
  };
};