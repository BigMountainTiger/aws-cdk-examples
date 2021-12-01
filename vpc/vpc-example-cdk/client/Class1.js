class Class1 {

  constructor() {
    this.number = 0;
  }

  Initiate() {
    this.number = 100;
  }

  GetNumber() {
    return this.number;
  }
}

class Class2 {

  constructor() {

  }
}

module.exports = { Class1, Class2 }