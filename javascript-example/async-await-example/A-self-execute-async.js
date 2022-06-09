const a_func = () => {

    console.log('1. Starting the async block ***');

    (async () => {

        console.log('2. Start to create the promise');

        const p = new Promise((rs, rj) => {

            console.log('3. Setting the timeout');

            setTimeout(() => {
                
                console.log('8. Timeout reached');
                rs('Promise Resolution Result');

            }, 1000);

            console.log('4. Set the timeout completed');

        });

        console.log('5. Complete to create the promise');

        console.log('6. Starting to await the promise');

        const Result = await p;


        console.log('9. await completed');
        console.log(Result);


    })();


    console.log('7. async block returns **** ');
};

a_func();