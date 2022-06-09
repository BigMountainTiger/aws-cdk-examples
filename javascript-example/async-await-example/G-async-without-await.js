const a_func = async () => {

    return 'async without await';
}

const b_func = () => {

    console.log('Calling a async function, a promise is returned');
    console.log('In an asycn function, you have the option to await it, Otherwise, you need to "then" it into a callback function');

    const v = a_func();
    console.log(v);

    return 'The actual value is returned from a sync function';
}

(() => {
    const v = b_func();
    console.log(v);
})();