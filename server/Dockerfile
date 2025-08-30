FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8787

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . .

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s CMD wget -qO- http://localhost:8787/api/health || exit 1
CMD ["node", "server.js"]
