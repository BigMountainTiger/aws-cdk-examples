const m = require('./experiment-module');
const {v, _} = require('./experiment-module');

(async () => {

  console.log();
  console.log(`Before any operation v = ${v}`);
  console.log(`Before any operation m.o.v = ${m.o.v}`);

  console.log();
  m.increment_v();
  console.log('After increment_v():');
  console.log(`v = ${v}`);
  console.log(`m.v = ${m.v}`);
  console.log(`m.o.v = ${m.o.v}`);

  console.log();
  m.v = 200;
  console.log('After set m.v = 200:');
  console.log(`v = ${v} - Not changed because v is assigned before m.v is changed`);
  console.log(`m.v = ${m.v}`);
  console.log(`m.o.v = ${m.o.v}`);
  
  console.log();
  m.increment_o_v();
  console.log('After increment_o_v():');
  console.log(`v = ${v}`);
  console.log(`m.v = ${m.v}`);
  console.log(`m.o.v = ${m.o.v} - Modified because it is referenced through the object`);

  console.log();
  console.log('Note:');
  console.log('1. A Node require() imports a singleton object');
  console.log('2. Regardless how many times it is required, the object is only initiated once');
  console.log('3. Node is different from Python, as python module itself is the singleton object. Python has no exports/module.exports statements');

})();