// module.exports vs exports in Node.js
// https://stackoverflow.com/questions/7137397/module-exports-vs-exports-in-node-js

console.log('experiment-module.js is initiated only once');

let v = 100;
let increment_v = () => {
  v++;
};

let o = {
  v: 100
}

let increment_o_v = () => {
  o.v++;
};

module.exports = {
  v: v,
  o: o,
  increment_v: increment_v,
  increment_o_v: increment_o_v
};
