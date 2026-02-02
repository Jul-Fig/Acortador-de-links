FROM node:24-alpine AS builder

LABEL org.opencontainers.image.title="url-shortener-api"
LABEL org.opencontainers.image.description="Backend API para URL Shortener"
LABEL org.opencontainers.image.version="1.0.0"


WORKDIR /app


COPY package*.json ./


RUN npm ci --only=production


COPY . .


RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001


RUN chown -R nodejs:nodejs /app


USER nodejs


EXPOSE 3000


HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"


CMD ["node", "server.js"]