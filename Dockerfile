FROM oven/bun:1@sha256:ec06c3b6cea04192ae6770c434f668ca41d343ad19fa6472216c7b48be39c598 AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . ./

# ARG EXAMPLE_VARIABLE

RUN bun run build

FROM oven/bun:1@sha256:ec06c3b6cea04192ae6770c434f668ca41d343ad19fa6472216c7b48be39c598

WORKDIR /app

COPY --from=build /app/.output/ ./

ENV NODE_ENV=production

CMD ["bun", "run", "/app/server/index.mjs"]
