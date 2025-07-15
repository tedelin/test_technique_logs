FROM node:24-alpine as base

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml ./

COPY package.json ./

RUN pnpm install

CMD ["pnpm", "run", "dev"]