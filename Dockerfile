FROM oven/bun:1@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . ./

# ARG EXAMPLE_VARIABLE

RUN bun run build

FROM oven/bun:1@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d

WORKDIR /app

COPY --from=build /app/.output/ ./

ENV NODE_ENV=production

CMD ["bun", "run", "/app/server/index.mjs"]
