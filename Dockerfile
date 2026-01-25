# Base stage
FROM node:20-alpine AS base
WORKDIR /usr/src/app
# Add openssl for Prisma
RUN apk add --no-cache openssl

# Dependencies stage
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Build stage
FROM base AS builder
COPY package*.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/prisma ./prisma
COPY start.sh ./start.sh

RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]
