FROM oven/bun:1.2.17

WORKDIR /app

COPY package.json bun.lock ./

COPY packages/db/package.json packages/db/

COPY services/api-service/package.json services/api-service/

RUN bun install

COPY . .

RUN bunx prisma generate --schema=packages/db/prisma/schema.prisma

WORKDIR /app/services/api-service

EXPOSE 3000

CMD ["bun", "start"]
