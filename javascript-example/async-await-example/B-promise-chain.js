let run_count = 0;

const p = new Promise((rs, rj) => {
  setTimeout(() => {
    rs(`No.${++run_count} - run`);
  }, 1000);
});

const run = () => 
{
  p.then(d => {
    console.log(d);
  
    return new Promise((rs, rj) => {
      setTimeout(() => {
        rs(`No.${++run_count} - run`);
      }, 1000);
    });
  
  }).then(d => {
    console.log(d);
  
    return new Promise((rs, rj) => {
      setTimeout(() => {
  
        rs(`No.${++run_count} - run`);
        throw 'Exception in callback';
  
      }, 1000);
    });
  }).then(d => {
    console.log(d);
  
  }).catch(e => {
    
    console.log(e);
  
  })
};

try {
  run();
} catch(e) {
  
  console.log('Exception caught');
  console.log(e);
}