const a_func = async () => {

    console.log('4. Entering async function with await');

    console.log('5. Creating the promise');
    const p = new Promise((rs, rj) => {
        rs('Resolved without timeout');
    });

    console.log('6. Created the promise');

    console.log('7. Starting to await the promise');
    const result = await p;

    console.log('9. await completed');

    return result;

};

const b_func = async () => {

    console.log('2. Entering async but no await');
    console.log('3. awaiting an async function to return')
    const result = await a_func();

    return result;

};

const c_func = () => {

    console.log('1. Started');

    const result = b_func();

    console.log(result);
    result.then((data) => {
        console.log('This should be the last')
        console.log(data);
    });

    console.log('8. No await in the main function, so it completed')

};

c_func();


