const a_func = async () => {

    console.log('4. Entering async function with await');

    console.log('5. Creating the promise');
    const p = new Promise((rs, rj) => {

        console.log('6. Scheduling the timeout');
        setTimeout(() => {

            console.log('11. Timeout reached, promise resolved');
            rs('Resolved after timeout');
        }, 1000);

        console.log('7. Scheduled the timeout');
    });

    console.log('8. Created the promise');

    console.log('9. Starting to await the promise');
    const result = await p;

    console.log('12. await completed');

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
    console.log('10. No await in the main function, so it completed')

};

c_func();


