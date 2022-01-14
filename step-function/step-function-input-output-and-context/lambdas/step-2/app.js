exports.lambdaHandler = async (event, context) => {

  const STEP = 'STEP 2';

  console.log(STEP);
  console.log(event);

  return {
    text: `This is the ${STEP}`
  };
};