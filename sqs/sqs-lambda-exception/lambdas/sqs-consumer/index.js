exports.handler = async (event, context) => {
  console.log(event);
  
  throw new Error('Artificial error');
  return {};
};