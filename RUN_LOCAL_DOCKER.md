# Run Locally with Docker
Prereq: Docker Desktop installed
1) server/.env -> copy .env.example to .env, set:
   SITE_URL=http://localhost:8080
   CORS_WHITELIST=http://localhost:8080
2) From project root:
   docker compose up --build
Open:
  http://localhost:8080
  http://localhost:8080/api/health
Stop: docker compose down
