const cdk = require('@aws-cdk/core');
const eventSources = require('@aws-cdk/aws-lambda-event-sources');
const add_sqs = require('./resources/add_sqs');
const add_lambdas = require('./resources/add_lambdas');
const add_api = require('./resources/add_api');

class BotTemplateCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const queue = add_sqs(this);
    const { sqs_publisher, sqs_consumer } = add_lambdas(this);
    add_api(this, sqs_publisher);
    sqs_consumer.addEventSource(new eventSources.SqsEventSource(queue, { batchSize: 1 }));
  }
}

module.exports = { BotTemplateCdkStack }
