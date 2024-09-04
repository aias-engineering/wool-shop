FROM bitnami/node:latest

WORKDIR /app

COPY package.json .

RUN npm install

ENV PATH /app/node_modules/.bin:$PATH

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm","run","start"]