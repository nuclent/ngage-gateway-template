# syntax=docker/dockerfile:1.4

ARG BASE_TAG

FROM registry.i.mscnr.com/ci/nc-core-base-node:$BASE_TAG as cache
ARG DIST_PATH

WORKDIR /server
COPY --link yarn.lock ./
COPY --link ${DIST_PATH}/package.json ./
RUN yarn --frozen-lockfile --prod --offline --silent

FROM harbor.common.nuclent.com/library/node:16-alpine
ARG SERVER_PROJECT
ARG DIST_PATH
ARG APP_VERSION

RUN rm -rf /var/cache/apk/* /usr/local/lib/node_modules/npm /usr/local/bin/npm

ENV NODE_ENV production
ENV APP_VERSION $APP_VERSION
ENV PORT 3000
ENV DOTENV_PATH /vault/secrets/.env
ENV TZ 'Asia/Ho_Chi_Minh'
ENV SERVER_PROJECT $SERVER_PROJECT

WORKDIR /server
COPY --link tools/scripts/start-prod.sh ./
COPY --link --from=cache /server/node_modules /server/node_modules/
COPY --link ${DIST_PATH}/. ./
RUN rm -rf package.json

USER node
CMD ["/server/start-prod.sh"]
