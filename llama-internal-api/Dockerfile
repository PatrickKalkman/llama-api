FROM node:20-alpine3.18

RUN apk update && \
    apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Europe/Amsterdam /etc/localtime && \
    echo "Europe/Amsterdam" > /etc/timezone && \
    rm -rf /var/cache/apk/*

EXPOSE 8000

WORKDIR /home/node/app

USER root
RUN chown -R node:node /home/node/app
USER node

COPY --chown=node:node package*.json ./
RUN npm install --only=prod && npm cache clean --force

COPY --chown=node:node . .

CMD [ "node", "index.js" ]