# ==========================
# Stage 1: Build
# ==========================

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# ==========================
# Stage 2: Production
# ==========================

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app .

RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    mkdir -p /app/logs && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

CMD ["npm", "start"]