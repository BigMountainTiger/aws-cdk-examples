const express = require('express');

const port = 8000;
const app = express();

app.get('/healthcheck', (req, res) => {
    res.status(200).send('OK');
});

app.get('/0.exception-in-unmanaged-callback-crash-the-server', (req, res) => {

    const p = new Promise((rs, rj) => {

        setTimeout(() => {
            // Exception here is not caught by the promise chain
            throw 'Exception in unmanaged callback crash the server, need to reject the promise so it is caught';

        }, 0);

    });

    p.then(r => {

    }).catch(e => {

    });

});


app.get('/1.exceptions-in-then-function', (req, res) => {
    const p = new Promise((rs, rj) => {
        rs(0);
    });

    p.then(r => {
        throw `No catch - ${r}`;
    }).catch(e => {

        res.statusCode = 500;
        res.send({
            comment1: 'Exceptions in the then function is converted into a promise rejection',
            comment2: 'Exceptions in the then function can be caught by the catch function',
            comment3: 'Catch function is always necessary, any rejection can crash the server',
            error: e
        });
    });

});

app.get('/2.static-return-can-be-chained', (req, res) => {

    const p = new Promise((rs, rj) => {
        rs(0);
    });

    p.then(r => {
        return r + 1;
    }).then(r => {
        res.send({
            comment: 'Static return in the then function can be chained',
            r: r
        });
    });

});

app.get('/3.void-then-fucntion-can-be-chained', (req, res) => {

    const p = new Promise((rs, rj) => {
        rs(0);
    });

    p.then(r => { }).then(r => {
        res.send({
            comment: 'Void then function can be chained',
            r: `The input parameter = ${r}`
        });
    });

});

app.get('/4.exceptions-in-async-function-can-be-caught', (req, res) => {

    const p = new Promise((rs, rj) => {
        setTimeout(() => {
            rs(0);
        }, 0);
    });

    const func = async () => {

        const r = await p;

        throw 'Exception in async function';
    };

    func().then(r => {
    }).catch(e => {
        res.send({
            comment1: 'Exception in async function can be caught',
            comment2: 'the await keyword is equivalent to the then() function',
            comment2: 'Exceptions in the then() function is converted to promise rejection',
            e: `The exception = ${e.toString()}`
        });
    });

});

app.get('/5.execution-order', (req, res) => {

    const executions = [];

    const p = new Promise((rs, rj) => {
        setTimeout(() => {

            rs(0);
            executions.push('Promise resolved');
        }, 0);

        executions.push('Promise construction function ran to the end');
    });

    p.then(r => {
        executions.push(`then() function called - ${r}`);

        res.send({
            comment: 'Promise contruction function will run to the end',
            executions: executions
        });
    })

    executions.push('Controller action function completed');
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});