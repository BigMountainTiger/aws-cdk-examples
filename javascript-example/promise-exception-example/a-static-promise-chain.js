const p = new Promise((rs, rj) => {
    rs(0);
});

p.then(r => {
    console.log(r);
    return r + 1;
}).then(r => {
    console.log(r);
    return r + 1
}).then(r => {
    console.log(r);
}).then(r => {
    console.log(r);
}).then(r => {
    console.log(r);
    throw 'OK';
}).catch(e => {
    console.log(e);
})

console.log('Promise callbacks are scheduled');