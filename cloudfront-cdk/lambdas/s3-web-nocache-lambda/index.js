exports.lambdaHandler = async (event, context, callback) => {
  const cf = event.Records[0].cf;
  const request = cf.request;
  const response = cf.response;
  const headers = response.headers;

  console.log(request);

  headers['cache-control'] = [{key: 'cache-control', value: 'no-cache, no-store, must-revalidate'}];
  headers['expires'] = [{key: 'expires', value: '-1'}];
  headers['Pragma'] = [{key: 'Pragma', value: 'no-cache'}];
  
  callback(null, response);

};