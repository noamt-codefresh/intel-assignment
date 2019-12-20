FROM node:12.14.0-slim

COPY package.json /usr/package.json
COPY tsconfig.json /usr/tsconfig.json
COPY tsconfig.app.json /usr/tsconfig.app.json
COPY angular.json /usr/angular.json
RUN cd /usr && npm i && \
 npm i -g @angular/cli@8.1.3

COPY ./src /usr/src

WORKDIR /usr

CMD ng serve --host 0.0.0.0
