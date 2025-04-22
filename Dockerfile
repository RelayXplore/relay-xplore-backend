# Dockerfile
FROM node:23-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:23-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev

# Expose the port the app runs on
EXPOSE 4000

# Pass environment variables at runtime
CMD ["node", "dist/main"]
