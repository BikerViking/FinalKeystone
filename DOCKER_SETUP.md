# Docker Desktop First-Run (Windows)
- Enable WSL 2 (recommended). Do NOT enable Windows Containers.
- Start Docker Desktop (whale icon).
- Verify:
  wsl --list --verbose
  docker --version
  docker compose version
- Test:
  docker run hello-world
