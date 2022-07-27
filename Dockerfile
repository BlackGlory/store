FROM node:16-alpine AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN apk add --update --no-cache --virtual .build-deps \
      # better-sqlite3
      build-base \
      python3 \
 && yarn install \
 && yarn cache clean \
 && apk del .build-deps

COPY . ./

RUN yarn build \
 && yarn bundle

FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/lib /usr/src/app/lib
COPY package.json yarn.lock ./

RUN apk add --update --no-cache --virtual .build-deps \
      # better-sqlite3
      build-base \
      python3 \
 && yarn install --production \
 && yarn cache clean \
 && apk del .build-deps \
 && mkdir /data \
 && ln -s /data data \
 && apk add --update --no-cache \
      # healthcheck
      curl

COPY . ./

ENV STORE_HOST=0.0.0.0
ENV STORE_PORT=8080
EXPOSE 8080
HEALTHCHECK CMD curl --fail http://localhost:8080/health || exit 1
ENTRYPOINT ["yarn"]
CMD ["--silent", "start"]
