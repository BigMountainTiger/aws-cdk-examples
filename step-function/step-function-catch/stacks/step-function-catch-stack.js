const cdk = require('aws-cdk-lib');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const sfn = require('aws-cdk-lib/aws-stepfunctions');
const tasks = require('aws-cdk-lib/aws-stepfunctions-tasks');

class StepFunctionCatchStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const role = (() => {
      const role_name = `${id}_Lambda_role`;
      const principal = new iam.ServicePrincipal('lambda.amazonaws.com');
      const role = new iam.Role(this, role_name, { roleName: role_name, description: role_name, assumedBy: principal });
      role.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW, resources: ['*'], actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents'
        ]
      }));

      return role;
    })();

    const create_javascript_lambda = (name, path) => {
      const lambda_name = `${id}_${name}`;

      return new lambda.Function(this, lambda_name, {
        runtime: lambda.Runtime.NODEJS_14_X,
        functionName: lambda_name,
        description: lambda_name,
        timeout: cdk.Duration.seconds(15),
        role: role,
        code: lambda.Code.fromAsset(path),
        memorySize: 128,
        handler: 'app.lambdaHandler'
      });
    };

    const create_python_lambda = (name, path) => {
      const lambda_name = `${id}_${name}`;

      return new lambda.Function(this, lambda_name, {
        runtime: lambda.Runtime.PYTHON_3_9,
        functionName: lambda_name,
        description: lambda_name,
        timeout: cdk.Duration.seconds(30),
        role: role,
        code: lambda.Code.fromAsset(path),
        handler: 'app.lambda_handler'
      });

    };

    const raise_lambda = create_javascript_lambda('RAISE_LAMBDA', './lambdas/raise-lambda');
    const catch_lambda = create_python_lambda('CATCH_LAMBDA', './lambdas/catch-lambda');
    const success_lambda = create_python_lambda('SUCCESS_LAMBDA', './lambdas/success-lambda');

    (() => {

      const raise_task = (() => {
        const NAME = `${id}-RAISE-TASK`;

        return new tasks.LambdaInvoke(this, NAME, {
          lambdaFunction: raise_lambda,
          retryOnServiceExceptions: false,
          inputPath: '$',
          outputPath: '$'
        });

      })();

      const catch_task = (() => {
        const NAME = `${id}-CATCH-TASK`;

        return new tasks.LambdaInvoke(this, NAME, {
          lambdaFunction: catch_lambda,
          retryOnServiceExceptions: false,
          inputPath: '$',
          outputPath: '$'
        });

      })();

      const success_task = (() => {
        const NAME = `${id}-SUCCESS-TASK`;

        return new tasks.LambdaInvoke(this, NAME, {
          lambdaFunction: success_lambda,
          retryOnServiceExceptions: false,
          outputPath: '$',
          payload: sfn.TaskInput.fromObject({
            'Payload.$': '$',
            'Input.$': '$$',
            'Invocation': 'Data ingestion completed'
          })
        });

      })();

      // Default - catch all
      raise_task.addCatch(catch_task);
      raise_task.next(success_task);
      

      const NAME = `Experiment_STEP_FUNCTION`;
      new sfn.StateMachine(this, `${id}-${NAME}`, {
        stateMachineName: NAME,
        definition: sfn.Chain.start(raise_task),
        timeout: cdk.Duration.minutes(5)
      });

    })();

  }
}

module.exports = { StepFunctionCatchStack }
