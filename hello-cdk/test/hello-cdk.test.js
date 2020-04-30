const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const HelloCdk = require('../lib/hello-cdk-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    const stack = new HelloCdk.HelloCdkStack(app, 'MyTestStack');
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
