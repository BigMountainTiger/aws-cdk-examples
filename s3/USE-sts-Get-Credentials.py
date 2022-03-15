# USE STS to get Credentials

client = boto3.client('sts')
response = client.assume_role(
    RoleArn='arn:aws:iam::ABCD......:role/cross_account_role',
    RoleSessionName="test"
)
AccessKeyId = response['Credentials']['AccessKeyId']
SecretAccessKey = response['Credentials']['SecretAccessKey']
SessionToken = response['Credentials']['SessionToken']
s3_client = boto3.client(
    's3',
    aws_access_key_id=AccessKeyId,
    aws_secret_access_key=SecretAccessKey,
    aws_session_token=SessionToken
)
s3_client.upload_file(targetFile, 'bucket-name', Key=key)
print('File Uploaded to s3')