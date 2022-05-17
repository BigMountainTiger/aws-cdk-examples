

const async_func = async () => {

    const p = new Promise((rs, rj) => {
        setTimeout(() => {
            rs('Success');
        }, 1000);
    });

    const result = await p;
    console.log(result);

}

// New version node can can call an async function directly
async_func();

