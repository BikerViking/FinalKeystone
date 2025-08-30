# Run Locally
This project has two parts:
- Client: React + Vite + Tailwind
- Server: Express API
Requirements: Node.js 18+
Install:
  cd client && npm ci
  cd ../server && npm ci
Env:
  cd server && cp .env.example .env
  SITE_URL=http://localhost:5173
  CORS_WHITELIST=http://localhost:5173
Run:
  server: cd server && npm run dev
  client: cd client && npm run dev
Open http://localhost:5173
Health http://localhost:8787/api/health
