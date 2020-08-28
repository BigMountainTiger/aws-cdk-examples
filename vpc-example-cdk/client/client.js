const { Class1 } = require('./Class1');

(async () => {

  const class1 = new Class1();

  console.log(class1.GetNumber());

  class1.Initiate();

  console.log(class1.GetNumber());

})();