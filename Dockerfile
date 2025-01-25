FROM node:22-alpine

COPY package.json /app/
COPY src /app/src/

WORKDIR /app

RUN npm install

CMD [ "npm", "start" ]
