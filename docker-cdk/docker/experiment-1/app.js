const argv = process.argv;
const delay = 10;

(async () => {

  const r = await new Promise((rs, rj) => {
    setTimeout(() => {
      rs(argv);
    }, delay * 1000);
  });

  console.log(r[2]);
  console.log('End.')
})();

console.log('Started ...');