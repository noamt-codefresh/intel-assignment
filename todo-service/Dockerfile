FROM node:12.14.0-slim

COPY package.json /usr/package.json
RUN cd /usr && npm i

COPY dist /usr/dist

CMD node /usr/dist/app.js