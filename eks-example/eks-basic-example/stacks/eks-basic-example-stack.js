const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const eks = require('aws-cdk-lib/aws-eks');
const ec2 = require('aws-cdk-lib/aws-ec2');

require('dotenv').config();

class EksBasicExampleStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const clusterAdmin = (() => {

      const NAME = 'EKS-Admin-Role';
      const role = new iam.Role(this, NAME, {
        assumedBy: new iam.ArnPrincipal(process.env.USER_ID),
        roleName: NAME
      });

      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: ['*']
      }));

      return role;
      
    })();

    const cluster = (() => {

      const NAME = 'DEMO-EKS-CLUSTER'
      return new eks.Cluster(this, NAME, {
        clusterName: NAME,
        mastersRole: clusterAdmin,
        version: eks.KubernetesVersion.V1_21,
        defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
        defaultCapacity: 2
      });

    })();

  }
}

module.exports = { EksBasicExampleStack }
