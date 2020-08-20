# https://hackernoon.com/incorporate-aws-fargate-into-step-functions-8003d688d027
# https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

FROM node:14.4.0-alpine

WORKDIR /app/node

COPY app.js .

ENTRYPOINT [ "node",  "app.js" ]
CMD []


# docker build -t experiment-1:0.0.1 .
# docker run --rm experiment-1:0.0.1
# docker run --rm experiment-1:0.0.1 "SONG is stupid"

# https://docs.aws.amazon.com/step-functions/latest/dg/sample-project-container-task-notification.html