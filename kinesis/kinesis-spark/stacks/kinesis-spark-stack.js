const cdk = require('aws-cdk-lib');
const kinesis = require('aws-cdk-lib/aws-kinesis');

class KinesisSparkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    (() => {

      const NAME = 'MY-TEST-STREAM';
      const stream = new kinesis.Stream(this, `${id}-${NAME}`, {
        streamName: NAME,
        shardCount: 1
      });

      stream.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      
    })();
    
  }
}

module.exports = { KinesisSparkStack }
