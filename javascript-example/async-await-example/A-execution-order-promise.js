const a_fun = () => {

    console.log('1. Promise creating');
    const p = new Promise((rs, rj) => {

        console.log('2. Timeout scheduling');
        setTimeout(() => {

            console.log('7. Timeout triggered');

            rs('Resolved data');
        }, 1000);

        console.log('3. Timeout scheduled');
    });

    console.log('4. Promise created');

    console.log('5. Promise Subscribing');
    p.then(data => {
        console.log('8. Then is called');
        console.log(data);
    });

    console.log('6. Promise Subscribed');
};

a_fun();