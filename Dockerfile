# Small production image: build with the full toolchain, then ship only
# Next.js' standalone server, static assets and public files on Alpine.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Public env vars are inlined into the client bundle, so they're needed at build time.
ARG NEXT_PUBLIC_LOGO_DEV_KEY=""
ENV NEXT_PUBLIC_LOGO_DEV_KEY=$NEXT_PUBLIC_LOGO_DEV_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runtime: bare Alpine plus just the node binary (no npm, npx, corepack or yarn).
FROM alpine:3.24 AS run
RUN apk add --no-cache libstdc++ \
 && addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=deps /usr/local/bin/node /usr/local/bin/node
WORKDIR /app
ARG PORT=3000
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=$PORT
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public
USER nextjs
EXPOSE $PORT
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" >/dev/null || exit 1
CMD ["node", "server.js"]
