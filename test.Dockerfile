FROM node:11-alpine

RUN echo "**** install Python ****" && \
    apk add --no-cache python && \
    if [ ! -e /usr/bin/python ]; then ln -sf python /usr/bin/python ; fi && \
    \
    echo "**** install pip ****" && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --no-cache --upgrade pip setuptools wheel && \
if [ ! -e /usr/bin/pip ]; then ln -s pip /usr/bin/pip ; fi

WORKDIR /srv/app

COPY . .

RUN npm i
RUN npm run lint
