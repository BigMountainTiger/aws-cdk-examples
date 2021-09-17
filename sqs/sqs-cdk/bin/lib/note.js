// const role = new iam.Role(this, 'MyRole', {
//   roleName: 'MyRole',
//   assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
// });

// const policy = new iam.Policy(this, 'MyPolicy', {
//   policyName: 'MyPolicy',
//   statements: [
//     new iam.PolicyStatement({
//       resources: ['*'],
//       actions: ['lambda:InvokeFunction'] 
//     })
//   ]
// });

// console.log(policy);

// role.addToPolicy(new iam.PolicyStatement({
//   resources: ['*'],
//   actions: ['lambda:InvokeFunction'] 
// }));