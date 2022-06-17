FROM node:14.4.0-alpine

WORKDIR /app/node

COPY package.json .
RUN npm install --production --no-package-lock

COPY app.js .

ENTRYPOINT [ "node",  "app.js" ]
CMD []


# docker build -t experiment-1:0.0.1 .
# docker run -v $HOME/.aws:/root/.aws:ro --rm experiment-1:0.0.1
# docker run -v $HOME/.aws:/root/.aws:ro --rm experiment-1:0.0.1 "SONG is stupid"

# https://docs.aws.amazon.com/step-functions/latest/dg/sample-project-container-task-notification.html

# By default ECS always pull the image. Only when it fails, it tries to use the local copy
# Look for - ECS_IMAGE_PULL_BEHAVIOR
# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html