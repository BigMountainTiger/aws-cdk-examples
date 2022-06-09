const a_fun = async () => {

    // Immediate rejection is caught
    let p_exception = new Promise((rs, rj) => {
            rj('Immediately Rejected');
    });

    try {
        await p_exception;
    } catch (e) {
        console.log('Immediate Rejection is caught by the catch block');
        console.log(e);
    }

    // Callback rejection is caught
    console.log();
    p_exception = new Promise((rs, rj) => {
        setTimeout(() => {
            rj('Callback Rejected');
        }, 1000);
    });

    try {
        await p_exception;
    } catch (e) {
        console.log('Callback Rejection is caught by the catch block');
        console.log(e);
    }

    // Immediate exception is caught
    console.log();
    p_exception = new Promise((rs, rj) => {
        throw 'Immediately Exception';
    });

    try {
        await p_exception;
    } catch (e) {
        console.log('Immediate Exception is caught by the catch block');
        console.log(e);
    }

    // Exception in the callback is NOT caught
    console.log();
    p_exception = new Promise((rs, rj) => {
        setTimeout(() => {
            throw 'Callback Exception';
        }, 1000);
    });

    try {
        await p_exception;
    } catch (e) {
        console.log('Callback Exception is not caught by the catch block');
        console.log(e);
    }

};

// The exception thrown in callback functions NOT caught by the catch block
(async () => {
    await a_fun();
})();
