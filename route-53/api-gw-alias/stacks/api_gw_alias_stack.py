from ast import alias
from aws_cdk import (
    aws_iam as iam,
    aws_lambda as lmbda,
    aws_apigateway as apigw,
    aws_certificatemanager as acm,
    aws_route53 as route53
)
from constructs import Construct
import aws_cdk as cdk
import os
from xml import dom
from dotenv import load_dotenv
load_dotenv()


class ApiGwAliasStack(cdk.Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        def create_role():

            NAME = f'{construct_id}-Lambda-ROLE'
            role = iam.Role(self, NAME, role_name=NAME, assumed_by=iam.ServicePrincipal(
                'lambda.amazonaws.com'))
            role.add_to_policy(iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                resources=['*'],
                actions=['logs:CreateLogGroup',
                         'logs:CreateLogStream', 'logs:PutLogEvents']
            ))

            return role

        role = create_role()

        def create_func():

            NAME = f'{construct_id}-Example-Lmabda'
            path = './lambdas/example_lambda'

            func = lmbda.Function(self, id=NAME, runtime=lmbda.Runtime.PYTHON_3_9, role=role,
                                  function_name=NAME, memory_size=128, timeout=cdk.Duration.seconds(5),
                                  code=lmbda.Code.from_asset(path), handler='app.lambdaHandler')

            func.add_permission(id='ApiAccessPermission', principal=iam.ServicePrincipal(
                'apigateway.amazonaws.com'))

            return func

        func = create_func()

        def create_api():

            NAME = f'{construct_id}-API'
            api = apigw.RestApi(self, id=NAME, rest_api_name=NAME, description=NAME, endpoint_types=[
                                apigw.EndpointType.REGIONAL])

            R = api.root.add_resource('get')
            R.add_method(http_method='GET', integration=apigw.LambdaIntegration(
                handler=func, proxy=True))

            return api

        api = create_api()

        def create_domain():
            REGION = 'us-east-1'
            CERT_ARN = os.environ['CERT_ARN']
            NAME = f'{construct_id}-API-DOMAIN'

            cert = acm.Certificate.from_certificate_arn(
                self, f'{construct_id}-ACM-CERT', certificate_arn=CERT_ARN)
            domain = apigw.DomainName(self, id=NAME, certificate=cert,
                                      domain_name='www.bigmountaintiger.com', security_policy=apigw.SecurityPolicy.TLS_1_2)
            domain.add_base_path_mapping(
                target_api=api, stage=api.deployment_stage)

            return domain

        domain = create_domain()

        def create_alias():
            HOSTED_ZONE_ID = os.environ['HOSTED_ZONE_ID']
            hostedZone = route53.HostedZone.from_hosted_zone_attributes(
                self, id=f'{construct_id}-HOSTED-ZONE', hosted_zone_id=HOSTED_ZONE_ID, zone_name='bigmountaintiger.com')

            route53_alias = route53.ARecord(
                self, id=f'{construct_id}-ALIAS', zone=hostedZone, record_name='www',
                target=route53.RecordTarget.from_alias(
                    cdk.aws_route53_targets.ApiGatewayv2DomainProperties(
                        regional_domain_name=domain.domain_name_alias_domain_name,
                        regional_hosted_zone_id=domain.domain_name_alias_hosted_zone_id
                    )
                )
            )

            route53_alias.apply_removal_policy(cdk.RemovalPolicy.DESTROY)

            return route53_alias

        create_alias()

        # def create_cname():
        #     HOSTED_ZONE_ID = os.environ['HOSTED_ZONE_ID']
        #     hostedZone = route53.HostedZone.from_hosted_zone_attributes(
        #         self, id=f'{construct_id}-HOSTED-ZONE', hosted_zone_id=HOSTED_ZONE_ID, zone_name='bigmountaintiger.com')

        #     cname = route53.CnameRecord(self, f'{construct_id}-CNAME', zone=hostedZone, record_name='www.bigmountaintiger.com',
        #                                 domain_name=domain.domain_name_alias_domain_name, ttl=cdk.Duration.seconds(30))

        #     cname.apply_removal_policy(cdk.RemovalPolicy.DESTROY)

        #     return cname

        # create_cname()

        cdk.CfnOutput(scope=self, id='API', value=api.rest_api_id)
        cdk.CfnOutput(scope=self, id='hosted_zone_id', value=os.environ['HOSTED_ZONE_ID'])
        cdk.CfnOutput(scope=self, id='domain.hosted_zone_id', value=domain.domain_name_alias_hosted_zone_id)

