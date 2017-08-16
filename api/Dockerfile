FROM node:8.1.2-alpine

RUN apk --update add postgresql-client docker && rm -rf /var/cache/apk/* && mkdir /node_tmp
COPY package.json yarn.lock /node_tmp/
RUN cd /node_tmp && yarn --pure-lockfile

RUN mkdir -p /usr/src/app && cd /usr/src/app && ln -s /node_tmp/node_modules

WORKDIR /usr/src/app
COPY . .
RUN yarn build

CMD [ "tools/wait-for-pg.sh", "db", "--", "yarn db-migrate && node build/server.js" ]
