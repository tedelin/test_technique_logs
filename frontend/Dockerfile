FROM node:24-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml ./

COPY package.json ./

RUN pnpm install

COPY . .

CMD ["pnpm", "run", "dev"]