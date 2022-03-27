exports.lambdaHandler = async (event, context) => {

    console.log(event);

    for(const record of event.Records) {

        console.log(record);
        const data = record.kinesis.data;
        const data_str = (new Buffer.from(data, 'base64')).toString();

        console.log(data_str);

    }

    context.succeed();

    // If fail, it will retry it for the configured number of times
    // context.fail('Failed');
};