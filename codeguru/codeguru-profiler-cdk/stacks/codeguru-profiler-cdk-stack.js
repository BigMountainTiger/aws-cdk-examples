const cdk = require('aws-cdk-lib');
const codeguruprofiler = require('aws-cdk-lib/aws-codeguruprofiler');
const iam = require('aws-cdk-lib/aws-iam');

class CodeguruProfilerCdkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {

      const NAME = 'CODEGURU-TEST-ROLE';
      const role = new iam.Role(this, NAME, {
        roleName: NAME,
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
      });

      new iam.CfnInstanceProfile(this, `${NAME}-Instance-Profile`, {
        roles: [NAME],
        instanceProfileName: NAME,
      });

      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonCodeGuruProfilerAgentAccess'));

      return role;

    })();

    const profilingGroup = (() => {

      const NAME = 'Test';
      const profilingGroup = new codeguruprofiler.ProfilingGroup(this, NAME, {
        profilingGroupName: NAME,
        computePlatform: codeguruprofiler.ComputePlatform.DEFAULT,
      });

      return profilingGroup;

    })();

    // This is not necessary if the role already has the profiler permissions
    // profilingGroup.grantPublish(role);

  }
}

module.exports = { CodeguruProfilerCdkStack }
