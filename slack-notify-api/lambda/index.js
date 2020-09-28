const send_msg = require('./slack-msg');

exports.handler = async (event, context) => {
  //console.log(event);

  await send_msg();

  console.log('Before return');
  return { statusCode: 200, body: 'OK' };
};