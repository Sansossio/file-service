FROM node:11-alpine

WORKDIR /srv/app

COPY . .

RUN npm install --only=dev
RUN npm run lint
