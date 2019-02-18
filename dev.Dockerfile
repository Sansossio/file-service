FROM node:alpine

WORKDIR /srv/app

COPY . .

RUN apk add --update \
  python \
  python-dev \
  py-pip \
  build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*
RUN npm i -g npm
RUN npm i -g tsc

CMD [ "npm", "run", "start:dev" ]