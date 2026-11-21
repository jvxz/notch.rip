FROM oven/bun:1@sha256:3aa040e5445efa09d75bb428a64ba50db13e2b3ac9b6b0c7f145615f62b2ee18 AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . ./

# ARG EXAMPLE_VARIABLE

RUN bun run build

FROM oven/bun:1@sha256:3aa040e5445efa09d75bb428a64ba50db13e2b3ac9b6b0c7f145615f62b2ee18

WORKDIR /app

COPY --from=build /app/.output/ ./

ENV NODE_ENV=production

CMD ["bun", "run", "/app/server/index.mjs"]
