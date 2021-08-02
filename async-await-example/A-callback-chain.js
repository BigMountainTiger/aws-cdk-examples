let run_count = 0

const chain = () => {
  setTimeout(() => {
    console.log(`No.${++run_count} - run`);

    setTimeout(() => {
      console.log(`No.${++run_count} - run`);

      setTimeout(() => {
        console.log(`No.${++run_count} - run`);
      }, 1000);

    }, 1000);

    throw 'Exception in the callback';
    
  }, 1000);

  throw 'Exception out of the callback';

};

try {
  chain();
} catch(e) {

  console.log(e);
}
