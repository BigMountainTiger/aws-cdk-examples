const argv = process.argv;
const delay = 10;

(async () => {

  const p = new Promise((rs, rj) => {
    setTimeout(() => {
      rs(argv);
    }, delay * 1000);
  });

  const r = await p;

  console.log(r);
  console.log('End.')
})();

console.log('Started ...');