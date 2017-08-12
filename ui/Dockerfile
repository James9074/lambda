FROM node:8.1.2

WORKDIR /usr/src/app

COPY package.json yarn.lock /tmp/
RUN cd /tmp && yarn --pure-lockfile
RUN mkdir -p /usr/src/app && cd /usr/src/app && ln -s /tmp/node_modules

COPY ./ /usr/src/app

CMD ["yarn", "start"]


