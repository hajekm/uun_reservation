FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY config/config.temp.js config/config.js

RUN npm install
COPY . .

EXPOSE 3001

CMD [ "node", "server.js" ]