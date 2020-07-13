var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

exports.lambdaHandler = async (event, context) => {
  console.log(event);

  const s3 = event.Records[0].s3;  
  var bucket = s3.bucket.name;
  var key =  decodeURIComponent(s3.object.key.replace(/\+/g, ' '));

  let params = {
    Bucket: bucket,
    Key: key
  };

  const o = await new Promise((rs, rj) => {
    const aws_s3 = new AWS.S3();

    aws_s3.getObject(params, (e, d) => {
      if (e) { rj(e); } else { rs(d); }
    });
  });

  const contentType = o.ContentType;
  const metadata = o.Metadata;
  
  params = {
      Bucket: bucket,
      Key: key,
      CopySource: encodeURIComponent(`${bucket}/${key}`),
      ContentType: contentType,
      Metadata: Object.assign(metadata, {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "-1"
      }),
      MetadataDirective: 'REPLACE'
  };

  const result = await new Promise((rs, rj) => {
    const aws_s3 = new AWS.S3();

    aws_s3.copyObject(params, (e, d) => {
      if (e) { rj(e); } else { rs(d); }
    });

  });

  console.log(result);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(result)
  };

};