// https://gist.github.com/joshbedo/47bab20d47c1754626b5

const AWS = require('aws-sdk'); 
AWS.config.update({region:'us-east-1'});

const createMultipartUpload = (s3) => {
  const multipartParams = {
    Bucket: 'snowflake.huge.head.li',
    Key: 'AExample.txt',
    ContentType: 'text/plain'
  };

  return new Promise((rs, rj) => {
    s3.createMultipartUpload(multipartParams, (err, multipart) => {
      if (err) { rj(err); } else { rs(multipart); }
    });
  });
};

const uploadPart = (s3, mp, data, partNum) => {
  const param = {
    Body: data,
    Bucket: mp.Bucket,
    Key: mp.Key,
    PartNumber: String(partNum),
    UploadId: mp.UploadId
  };

  return new Promise((rs, rj) => {
    s3.uploadPart(param, (err, mData) => {
      if (err) { rj(err); } else { rs({ mData: mData, part: { ETag: mData.ETag, PartNumber: partNum } }); }
    });
  });
};

const completeMultipartUpload = (s3, mp, mm) => {
  const param = {
    Bucket: mp.Bucket,
    Key: mp.Key,
    MultipartUpload: mm,
    UploadId: mp.UploadId
  };

  return new Promise((rs, rj) => {
    s3.completeMultipartUpload(param, (err, data) => {
      if (err) { rj(err); } else { rs(data); }
    });
  });
};

const abortMultipartUpload = (s3, mp) => {
  const param = {
    Bucket: mp.Bucket,
    Key: mp.Key,
    UploadId: mp.UploadId
  }

  return new Promise((rs, rj) => {
    s3.abortMultipartUpload(param, (err, data) => {
      if (err) { rj(err); } else { rs(data); }
    });
  });
}

(async () => {

  const s3 = new AWS.S3();

  const mm = { Parts: [] };
  const mp = await createMultipartUpload(s3);

  const p1 = await uploadPart(s3, mp, 'This is line No.1 and it is OK\n', 1);
  mm.Parts.push(p1.part);

  // The size of the part must be > 5MB, except the last part
  // const p2 = await uploadPart(s3, mp, 'This is line No.2\n', 2);
  // mm.Parts.push(p2.part);

  const result = await completeMultipartUpload(s3, mp, mm);
  //const result = await abortMultipartUpload(s3, mp);

  console.log(result);
})();

console.log('Started ...');