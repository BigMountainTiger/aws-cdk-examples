// Need base64 
// https://stackoverflow.com/questions/6978156/get-base64-encode-file-data-from-input-form
// https://stackoverflow.com/questions/3717793/javascript-file-upload-size-validation
// https://stackoverflow.com/questions/46358922/request-payload-limit-with-aws-api-gateway
// https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/

exports.handler = async (event, context) => {
  //console.log(event);
  
  return {
    statusCode: 200,
    body: JSON.stringify('OK')
  };
};