# OverlayForge

OverlayForge is a small streaming overlay manager combining a FastAPI backend and a Vite + React frontend. It provides overlays and a simple local music player. Alerts and chat are not implemented yet and are on the project's roadmap.

## Features

- Overlays web UI
- Alerts (planned)
- Chat panel (planned)
- Simple local music player

## Quick Start (Recommended)

Requirements: Docker and Docker Compose

1. Build and start services:

```bash
docker-compose up --build
```

2. Open the frontend at http://localhost:5173 (Vite default) and the API at http://localhost:8000

## Local Development

Backend (Python):

```bash
python -m venv .venv
.
.venv\\Scripts\\activate    # Windows
pip install -r Docker/API/requirements.txt
uvicorn FastAPI.api:app --reload --host 0.0.0.0 --port 8000
```

Frontend (Node):

```bash
cd vite
npm install
npm run dev
```

## Project Structure (high level)

- `FastAPI/` — backend app entry points and models
- `vite/` — React frontend built with Vite
- `Docker/` — Dockerfiles and container setup
- `docker-compose.yml` — local orchestration

## Contributing

Contributions are welcome. Open an issue or a PR against the `dev` branch.

## License

This project is available under the terms shown in the LICENSE file.
