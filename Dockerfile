FROM node:20.11-alpine

RUN apk add --update docker openrc
RUN rc-update add docker boot
RUN apk add docker docker-cli-compose
RUN apk update && apk add git

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node

RUN git clone https://github.com/Paiva2/riderize-rest.git
WORKDIR /home/node/app/riderize-rest
RUN touch .env
RUN { \
  echo 'PORT=8000'; \
  echo 'JWT_SECRET="ASIASJRFIJASF9ASF9ASF9I3W9R43QU32R8QWER@##&*¨%(*%¨&*%üjfjgfhgsf#@@#¨@#¨)@¨@#¨@#@##¨@"'; \
  echo 'JWT_ISSUER="renderize-test"'; \
  echo 'POSTGRES_USER=pglocal'; \
  echo 'POSTGRES_PASSWORD=pg123'; \
  echo 'POSTGRES_DB=riderize'; \
  echo 'POSTGRES_HOST=db'; \
  echo 'POSTGRES_PORT=5432'; \
  echo 'REDIS_HOST=redis'; \
  echo 'REDIS_PORT=6379'; \
} >> .env

RUN npm install

COPY --chown=node:node . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
