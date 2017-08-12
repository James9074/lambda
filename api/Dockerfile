FROM node:8.1.2-alpine

RUN apk --update add postgresql-client && rm -rf /var/cache/apk/*
COPY package.json yarn.lock /tmp/
RUN cd /tmp && yarn --pure-lockfile

RUN mkdir -p /usr/src/app && cd /usr/src/app && ln -s /tmp/node_modules

WORKDIR /usr/src/app
COPY . .
RUN yarn build

CMD [ "tools/wait-for-pg.sh", "db", "--", "yarn db-migrate && node build/server.js" ]
