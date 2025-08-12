FROM oven/bun AS build

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src
COPY ./scripts ./scripts
COPY ./prisma ./prisma
COPY ./generated ./generated

ENV NODE_ENV=production

# Run migrations
RUN bunx prisma generate 

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/server.ts

FROM oven/bun

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/generated ./generated
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

COPY --from=build /app/server server

ENV NODE_ENV=production

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
CMD [ "./server" ]

EXPOSE 3001