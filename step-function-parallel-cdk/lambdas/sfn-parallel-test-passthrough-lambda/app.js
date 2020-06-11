// SFNPARALLELTESTPASSTHROUGHLAMBDAFFBDA6B3

exports.lambdaHandler = async (event, context) => {
  
  console.log(event);
  const timeout = event.timeout || 1;
  
  await new Promise((rs, rj) => {

    setTimeout(() => {
      rs(`Waited for ${timeout} seconds`);
    }, timeout * 1000);
  });


  return {
    timeout: timeout
  };
};