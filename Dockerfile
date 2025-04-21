FROM node:23.11.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

COPY .env.example ./.env

EXPOSE 3001

CMD [ "npm", "run", "start:dev"]