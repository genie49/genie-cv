FROM oven/bun:latest AS build
WORKDIR /app

# Copy all workspace package.json files for lockfile compatibility
COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY apps/client/package.json ./apps/client/package.json

# Use hoisted linker for standard node_modules layout (bun 1.3+ defaults to isolated)
RUN echo '[install]\nlinker = "hoisted"' > bunfig.toml && bun install --frozen-lockfile

# Copy actual source code
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/client ./apps/client
COPY data ./data

WORKDIR /app/apps/client
RUN bun run build:docker

FROM nginx:alpine
COPY --from=build /app/apps/client/dist /usr/share/nginx/html
COPY --from=build /app/data/content/notes /usr/share/nginx/html/content/notes
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
