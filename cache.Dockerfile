FROM harbor.common.nuclent.com/library/node:16-alpine
RUN rm -rf /var/cache/apk/* /usr/local/lib/node_modules/npm /usr/local/bin/npm

WORKDIR /server
COPY --link .npmrc ./.npmrc
COPY --link yarn.lock ./yarn.lock
COPY --link cache.package.json ./package.json
RUN yarn --frozen-lockfile --prod --silent \
  && rm -rf /server/*
