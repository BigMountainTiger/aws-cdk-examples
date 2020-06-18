FROM node:14.4.0-alpine

WORKDIR /src/api

COPY package.json ./

RUN npm --loglevel=error install

COPY server.js ./

EXPOSE 8080
CMD ["node", "server.js"]

# docker build -t express-app .
# docker run -p 8080:8080 -d express-app