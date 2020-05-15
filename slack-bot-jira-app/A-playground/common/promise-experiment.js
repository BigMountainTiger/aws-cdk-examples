
const resolve_multiple = () => {
  let p = new Promise((rs, rj) => {
    setTimeout(() => {
      rs('At 3 second');
    }, 3 * 1000);

    setTimeout(() => {
      rs('At 6 second');
    }, 6 * 1000);
  });

  return p;
};

const rejected_await = async () => {
  let tm = null;

  let p = new Promise((rs, rj) => {
    setTimeout(() => {
      rj('I will reject this promose at 3 second');
    }, 3 * 1000);

    tm = setTimeout(() => {
      rs('I will resolve this promose at 6 second');
    }, 6 * 1000);
  });

  try {
    let res = await p;
    return res;
  } finally {
    clearTimeout(tm);
    console.log('finally is called')
  }
};

const call_await = async () => {
  try {
    let res = await rejected_await();
    return res;
  } catch(e) {
    throw Error(e);
  }
};

(async () => {

  // let res = await resolve_multiple();
  // console.log(res);

  try {
    let res = await call_await();
    console.log(res);
  } catch(e) {
    console.log(e.stack);
    console.info('This error is intentional to test how Javascript and Promise and Async handles errors')
  }

})();

console.log('Initiated ...');