const cdk = require('aws-cdk-lib');
const route53 = require('aws-cdk-lib/aws-route53');
var AWS = require("aws-sdk");
require('dotenv').config();

const tag = { key: 'RESOURCE-GROUP', value: 'ROUTE53-API' };

const load_api_info = async () => {

  const apis = [];

  const get_api_info = async (REGION) => {

    const tag_api = new AWS.ResourceGroupsTaggingAPI({ region: REGION });
    const resources = await tag_api.getResources({
      ResourceTypeFilters: [], TagFilters: [
        { Key: tag.key, Values: [tag.value] }]
    }).promise();

    const { api_domain, url } = (() => {
      let api_arn = null;

      for (const r of resources.ResourceTagMappingList || []) {
        const arn = r.ResourceARN;
        if (arn.includes('restapis') && (!arn.includes('stages'))) {
          api_arn = arn;
          break;
        }
      }

      if (!api_arn)
        return { api_domain: null, url: null };

      const id = api_arn.split('/').pop();
      const api_domain = `${id}.execute-api.${REGION}.amazonaws.com`;
      const url = `https://${api_domain}/prod`;

      return { api_domain, url };
    })();

    const domain_name = await (async () => {

      let domain_arn = null;

      for (const r of resources.ResourceTagMappingList || []) {
        const arn = r.ResourceARN;
        if (arn.includes('domainnames')) {
          domain_arn = arn;
          break;
        }
      }

      if (!domain_arn)
        return null;

      // Need to continue to obtain the domain for the API use the arn
      const gwy = new AWS.APIGateway({ region: REGION });
      const domain = await gwy.getDomainName({ domainName: 'www.bigmountaintiger.com' }).promise();
      const domain_name = domain.regionalDomainName;

      return domain_name;

    })();

    return {
      url: url,
      api_domain: api_domain,
      domain_name: domain_name
    };
  }

  const add_region = async (REGION) => {
    const info = await get_api_info(REGION)

    if (info.url && info.domain_name) {
      info['region'] = REGION;
      apis.push(info);
    }

  };

  await add_region('us-east-1');
  await add_region('us-east-2');

  return apis;
};

class ApiGwBasicRoute53Stack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const apis = props.apis;

    // Create the health checks
    (() => {

      for (let i = 0; i < apis.length; i++) {
        const api = apis[i];
        const health_check = new route53.CfnHealthCheck(this, `${id}-${api.region}-hck`, {
          healthCheckConfig: {
            type: 'HTTPS',
            fullyQualifiedDomainName: api.api_domain,
            resourcePath: '/prod/get',
            failureThreshold: 2,
            requestInterval: 30,
          },
          healthCheckTags: [{
            key: 'Name',
            value: `HCK-${api.region}`
          }],
        })

        api['health_check'] = health_check;

      }

    })();

    (() => {

      const HOSTED_ZONE_ID = process.env.HOSTED_ZONE_ID;
      const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, `${id}-HostedZone`, {
        hostedZoneId: HOSTED_ZONE_ID,
        zoneName: 'bigmountaintiger.com'
      });

      for (let i = 0; i < apis.length; i++) {

        const api = apis[i];
        // const cname = new route53.CnameRecord(this, `${id}-${api.region}-cname`, {
        //   zone: hostedZone,
        //   recordName: 'www.bigmountaintiger.com',
        //   domainName: api.domain_name,
        //   ttl: cdk.Duration.minutes(1)
        // });

        // cname.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        // route53.RecordSet Try it next time


        const record = new route53.CnameRecord(this, `${id}-${api.region}-ARECORD`, {
          recordName: 'www',
          zone: hostedZone,
          domainName: api.domain_name,
          ttl: cdk.Duration.seconds(30),
        });

        const recordSet = record.node.defaultChild;
        recordSet.setIdentifier = `${id}-${api.region}-ARECORD`,
          recordSet.healthCheckId = api.health_check.attrHealthCheckId;
        recordSet.failover = (i == 0) ? 'PRIMARY' : 'SECONDARY';

        record.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      }

    })();



  }
}

module.exports = { ApiGwBasicRoute53Stack, load_api_info }
