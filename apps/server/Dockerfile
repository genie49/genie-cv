FROM oven/bun:latest AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server
RUN bun install --frozen-lockfile --production

COPY apps/server/db ./apps/server/db

EXPOSE 3001
WORKDIR /app/apps/server
CMD ["bun", "src/index.ts"]
