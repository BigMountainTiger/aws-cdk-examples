exports.handler = async (event, context) => {

  const p = new Promise((rs, rj) => {

    setTimeout(() => {
      try {

        throw {
          messages: [
            '1. Exceptions thrown in callback functions can only be caught inside the callback function',
            '2. Exceptions thrown in callback functions are not caught by the code awaiting the promise',
            '3. Uncaught exceptions do not kill the lambda because it is running inside a container',
            '4. A promise rejection can be caught by the code awaiting the promise',
            '5. The exception will put an entry in the cloudwatch log',
            '6. A new cloudwatch stream is started per lambda container in the log group'
          ]
        };

        // This resolve will never happen
        // because throw happens before it
        rs({
          message: 'Promise is resolved'
        });
      }
      catch(e) {

        // Exception thrown in the callback functions
        // can only be caught inside the callback function
        rj(e);
      }

    }, 0.1 * 1000);

  });

  const result = {};
  try { result.message = await p; } catch(e) {
    // Promise rejection can be caught as an exception
    result['this-is-an-artificial-error'] = e;
  }

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(result)
  };
  
};