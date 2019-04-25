FROM node:11-alpine

WORKDIR /app

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apk update && apk upgrade
RUN apk add --no-cache python make g++
RUN echo http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      zlib-dev \
      xvfb \
      xorg-server \
      dbus \
      ttf-freefont \
      chromium \
      nss \
      ca-certificates \
      dumb-init

COPY . .

RUN npm install --build-from-source=hummus && \
    rm -rf node_modules/hummus/src && \
    rm -rf node_modules/hummus/build

RUN npm run build

COPY . .

CMD [ "npm", "run", "start:prod" ]
