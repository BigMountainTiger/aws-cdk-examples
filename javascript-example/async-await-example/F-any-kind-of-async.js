

const a_func = async () => {
    console.log('A called');

    const p = new Promise((rs, rj) => {

        console.log('Scheduling to resolve the value');

        setTimeout(() => {
            rs('Resolved');
        }, 1000);

        console.log('Scheduled to resolve the value in 1 second');
    });

    const result = await p;

    console.log(result);

    return result;
};

const b_func = async () => {
    const result = await a_func();

    console.log(result);
    console.log('Completed b_func')
};

const c_func = async () => {
    await b_func();
};

const d_func = async () => {
    await c_func();
};

// d_func();

// https://stackoverflow.com/questions/45594596/async-function-without-await-in-javascript

// An async function can contain an await expression,
// that pauses the execution of the async function and waits for the passed Promise's resolution,
// and then resumes the async function's execution and returns the resolved value.

// If no await is present, the execution is not paused and the code will be executed in a non-blocking manner.


// To use async function, you need to async all the way
// https://stackoverflow.com/questions/47227550/using-await-inside-non-async-function
// Or treat the async function return value as a promise, process anything in the callback function

// In Express application, async can not be directly used. Need some support
// https://zellwk.com/blog/async-await-express/

(async () => {
    await d_func();
})();