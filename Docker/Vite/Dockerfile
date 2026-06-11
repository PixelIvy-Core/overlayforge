FROM node:current-alpine

WORKDIR /app

COPY ./vite/package.json .

RUN npm install

RUN npm i -g serve

COPY ./vite .

RUN npm run build

CMD [ "serve", "-s", "dist" ]