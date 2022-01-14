#!/bin/sh

# if [ -z "${AWS_LAMBDA_RUNTIME_API}" ]; then
#     exec /usr/bin/aws-lambda-rie /var/lang/bin/python -m awslambdaric $1
# else
#     exec /var/lang/bin/python -m awslambdaric $1
# fi

if [ -z "${AWS_LAMBDA_RUNTIME_API}" ]; then
    exec /usr/bin/aws-lambda-rie /usr/bin/python3.9 -m awslambdaric $1
else
    exec /usr/bin/python3.9 -m awslambdaric $1
fi