const express = require('express');
const cluster = require('cluster');
const dynamodb = require('@aws-sdk/client-dynamodb');

const port = 8000;
const app = express();

app.get('/healthcheck', (req, res) => {
    res.status(200).send('OK');
});

const client = new dynamodb.DynamoDBClient();

const get_item = async (id) => {
    const TABLE_NAME = 'TABLE_1';

    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: { S: id },
            entry_time: { S: `entry_${id}` }
        },
    };

    const command = new dynamodb.GetItemCommand(params);
    const data = await client.send(command);
    const item = data.Item;

    return item;
};

app.get('/get-item', (req, res) => {
    const id = req.query['id'];

    get_item(id).then(i => {

        res.json({
            id: i?.id?.S,
            entry_time: i?.entry_time?.S,
            attr: i?.attr?.S
        });
    }).catch(e => {
        res.status(500).send(e.toString());
    });
});


let numCPUs = require('os').cpus().length;
numCPUs = 1;
if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        if (!worker.suicide) {
            console.log('Worker ' + worker.id + ' died. Replacing it.');
            cluster.fork();
        }
    });

} else {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    });
}