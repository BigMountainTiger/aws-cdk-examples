const tuc = require('temp-units-conv');

exports.handler = async (event, context) => {
  const c = tuc['f2c'](86);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `This is the temporature ${c}`
    })
  };
};