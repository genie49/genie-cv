FROM oven/bun:latest AS base
WORKDIR /app

# Copy all workspace package.json files first for lockfile compatibility
COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY apps/client/package.json ./apps/client/package.json

RUN bun install --frozen-lockfile --production

# Copy actual source code
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

EXPOSE 3001
WORKDIR /app/apps/server
CMD ["bun", "src/index.ts"]
