(async () => {

  try {
    const result = await new Promise((rs, rj) => {
      setTimeout(async () => {
        rj('Promise rejected');
      }, 1000);
    });

    console.log(result);

  } catch (ex) {
    console.log(ex);
  }

  console.log('End')

})();

console.log('Started ...')

