FROM node:14.4.0-alpine

WORKDIR /app/node

COPY package.json .
RUN npm install --production --no-package-lock

COPY app.js .

ENTRYPOINT [ "node",  "app.js" ]
CMD []

# docker run -v $HOME/.aws:/root/.aws:ro --rm experiment-1:0.0.1