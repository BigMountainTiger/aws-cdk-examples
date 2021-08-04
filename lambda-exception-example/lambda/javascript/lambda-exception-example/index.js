exports.handler = async (event, context) => {

  const p = new Promise((rs, rj) => {

    setTimeout(() => {
      try {
        throw 'This is stupid';

        rs({
          message: 'Each cloudwatch log stream is started by a new lambda container'
        });
      }
      catch(e) {
        rj(e);
      }

    }, 0.1 * 1000);

    throw 'This is stupid';
  });

  const result = {};
  try { result.message = await p; } catch(e) { result.error = e; }

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(result)
  };
  
};