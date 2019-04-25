FROM node:11-alpine

WORKDIR /app

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apk update && apk upgrade
RUN apk add --no-cache python make g++
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories && \
    apk add --no-cache \
    ca-certificates \
    ttf-freefont \
    chromium@edge \
    harfbuzz@edge \
    nss@edge \
    font-noto-emoji@edge \
    wqy-zenhei@edge && \
    # /etc/fonts/conf.d/44-wqy-zenhei.conf overrides 'monospace' matching FreeMono.ttf in /etc/fonts/conf.d/69-unifont.conf
    mv /etc/fonts/conf.d/44-wqy-zenhei.conf /etc/fonts/conf.d/74-wqy-zenhei.conf && \
    rm -rf /var/cache/apk/*

COPY . .

RUN npm install --build-from-source=hummus && \
    rm -rf node_modules/hummus/src && \
    rm -rf node_modules/hummus/build

RUN npm run build

COPY . .

CMD [ "npm", "run", "start:prod" ]
