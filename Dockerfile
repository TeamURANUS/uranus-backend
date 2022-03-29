FROM node:16.14-slim

WORKDIR /usr/src/app

COPY . .

RUN npm ci --only=production && npm cache clean --force

EXPOSE 8081

CMD ["node", "index.js"]

