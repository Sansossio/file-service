FROM node:11-alpine

RUN apt-get install -y python3-pip python3-dev \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
&& pip3 install --upgrade pip

WORKDIR /srv/app

COPY . .

RUN npm i
RUN npm run lint
