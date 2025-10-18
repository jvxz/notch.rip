FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . ./

# ARG EXAMPLE_VARIABLE

RUN bun run build

FROM oven/bun:1

WORKDIR /app

COPY --from=build /app/.output/ ./

ENV NODE_ENV=production

CMD ["bun", "run", "/app/server/index.mjs"]
