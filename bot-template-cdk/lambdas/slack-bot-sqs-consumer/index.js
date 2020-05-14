const tuc = require('temp-units-conv');

exports.handler = async (event, context) => {
  console.log(event);
  
  const c = tuc['f2c'](86);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `This is the lambda - ${c}`
    })
  };
};