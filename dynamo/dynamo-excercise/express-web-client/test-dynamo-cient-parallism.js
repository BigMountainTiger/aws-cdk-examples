const dynamodb = require('@aws-sdk/client-dynamodb');

const TABLE_NAME = 'TABLE_1';

const get_ids = async (limit) => {

    const client = new dynamodb.DynamoDBClient();
    const cmd = new dynamodb.ScanCommand({
        TableName: TABLE_NAME,
        Limit: limit
    });
    
    const entries = await client.send(cmd);
    return entries.Items.map((i) => i.id.S);
};

const test_parallelism = async (ids) => {
    const client = new dynamodb.DynamoDBClient();

    const promises = ids.map(async (id) => {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                id: { S: id },
                entry_time: { S: `entry_${id}` }
            },
        };
    
        const command = new dynamodb.GetItemCommand(params);
        const data = await client.send(command);

        return {
            sent: id,
            received: data.Item?.id?.S
        };
    });

    return await Promise.allSettled(promises);
};

(async () => {

    const limit = 10;
    // Get a list of ids
    const ids = await get_ids(limit);

    const startTime = new Date();
    const result = await test_parallelism(ids);
    const endTime = new Date();

    console.log(`Completed ${ids.length} requests in ${(endTime - startTime)} ms`);

    const failed = result.filter((i) => {i.status !== 'fulfilled'});
    console.log(`Failed = ${failed.length}`);
    const missed = result.filter((i) => {i.value.sent !== i.value.received});
    console.log(`Missed = ${missed.length}`);

    console.log(result);

})();