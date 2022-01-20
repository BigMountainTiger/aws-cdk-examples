exports.lambdaHandler = async (event, context) => {

  const CHOICE = 'CHOICE 1';

  console.log(CHOICE);
  console.log(event);

  return {
    text: `This is the ${CHOICE}`
  };
};