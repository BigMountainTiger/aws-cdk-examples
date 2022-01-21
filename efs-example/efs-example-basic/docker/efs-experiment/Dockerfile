FROM node:17.4.0-alpine

WORKDIR /app/node

COPY package.json .
RUN npm install --production --no-package-lock

COPY app.js .

ENTRYPOINT [ "node",  "app.js" ]
CMD []