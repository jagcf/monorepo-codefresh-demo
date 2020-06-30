FROM node:12-alpine AS build

RUN apk add python make g++

WORKDIR /opt/game

COPY package.json package-lock.json ./
COPY dist/ dist/
COPY node_modules/ node_modules/

RUN npm rebuild

FROM node:12-alpine AS dist

WORKDIR /opt/game
COPY --from=build /opt/game /opt/game
EXPOSE 8001

CMD [ "node", "./dist/index.js" ]
