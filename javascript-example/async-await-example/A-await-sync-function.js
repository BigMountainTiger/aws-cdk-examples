const a_func = () => {

    console.log('3. Executing a function');

    return 'Return value from sync function';
};

const b_func = async () => {

    console.log('2. Entering b function');

    // await always setup a callback, even it is awaiting a sync function
    const result = await a_func();

    console.log('6. await completed');
    
    console.log(result);

    console.log('7. await always setup a callback, even it is awaiting a sync function');

    return result;
}


const c_func = () => {

    console.log('1. Start the c_func');

    const result = b_func();

    console.log('4. b_func finished. It setup an await');

    console.log(result);
};

console.log('0. Start');

c_func();

console.log('5. First function invoke done\n')