FROM node:slim

RUN mkdir /app
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./
RUN npm install

EXPOSE 9000
CMD [ "node", "./bin/www" ]