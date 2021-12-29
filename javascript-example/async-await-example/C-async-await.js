let run_count = 0;

const p = new Promise((rs, rj) => {
  setTimeout(() => {
    // rs(`No.${++run_count} - run`);
    // rj('Failed');
    throw 'Exception in callback';
  }, 1000);
});



(async () => {
  try {
    const d = await (
      async () => {
        return await p;
      }
    )();
    console.log(d);

  } catch(e) {
    console.log(e);
  }
})();
