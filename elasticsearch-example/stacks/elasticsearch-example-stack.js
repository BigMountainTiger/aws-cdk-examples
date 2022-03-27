const cdk = require('aws-cdk-lib');
const ec2 = require('aws-cdk-lib/aws-ec2');
const iam = require('aws-cdk-lib/aws-iam');
const opensearch = require('aws-cdk-lib/aws-opensearchservice');

class ElasticsearchExampleStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const domain = (() => {
      const NAME = 'huge-head-li-example';

      const domain = new opensearch.Domain(this, `${id}-${NAME}`, {
        domainName: NAME,
        version: opensearch.EngineVersion.ELASTICSEARCH_7_10,
        accessPolicies: [
          new iam.PolicyStatement({
            actions: ['es:*'],
            effect: iam.Effect.ALLOW,
            principals: [new iam.AnyPrincipal],
            resources: ['*'],
          })
        ],
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        enforceHttps: true,
        nodeToNodeEncryption: true,
        encryptionAtRest: {
          enabled: true
        },
        capacity: {
          dataNodes: 1,
          dataNodeInstanceType: 't3.small.search'
        },
        ebs: {
          volumeType: ec2.EbsDeviceVolumeType.GP2,
          volumeSize: 10
        },
        fineGrainedAccessControl: {
          masterUserName: 'song',
          masterUserPassword: 'Passwd+123'
        }
      });

      return domain;

    })();

  }

}

module.exports = { ElasticsearchExampleStack }
