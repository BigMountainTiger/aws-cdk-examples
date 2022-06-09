const a_func = async () => {
    
    const p = new Promise((rs, rj) => {
        setTimeout(() => {
            rs('Resolved from a_func promise');
        }, 1000);
    });

    return await p;
}

// async function always returns a promise
const p = a_func();
p.then((r) => {
    console.log(r);
});