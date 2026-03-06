FROM oven/bun:latest AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/shared ./packages/shared
COPY apps/client ./apps/client
COPY data ./data
RUN bun install --frozen-lockfile
RUN cd apps/client && bun run build

FROM nginx:alpine
COPY --from=build /app/apps/client/dist /usr/share/nginx/html
COPY --from=build /app/data/content/notes /usr/share/nginx/html/content/notes
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
