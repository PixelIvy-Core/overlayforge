FROM node:current-alpine
WORKDIR /app
COPY ./vite/package.json .
ARG VITE_FASTAPI_URL
ENV VITE_FASTAPI_URL=${VITE_FASTAPI_URL}
RUN npm install
RUN npm i -g serve
COPY ./vite .
RUN npm run build
CMD [ "serve", "-s", "dist" ]