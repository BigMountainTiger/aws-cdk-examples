const cdk = require('@aws-cdk/core');
const add_sqs = require('./resources/add-sqs');
const add_lambdas = require('./resources/add-lambdas');
const eventSources = require('@aws-cdk/aws-lambda-event-sources');

class SnowflakPipeAutomationStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const queue = add_sqs(this);
    const lambda = add_lambdas(this);
    lambda.addEventSource(new eventSources.SqsEventSource(queue, { batchSize: 1 }));
  }
}

module.exports = { SnowflakPipeAutomationStack }
