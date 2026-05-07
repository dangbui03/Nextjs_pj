# VPS Docker Deployment

This folder contains a VPS-oriented Docker setup for the RepairShop Next.js app.

The Dockerfile intentionally stays thin: it starts from `ubuntu:16.04`, adds `provision.sh`, runs it, and uses `/var/www/app` as the working directory. All package installation, Node setup, and runtime startup behavior lives in `provision.sh`.

## Files

- `Dockerfile` builds the provisioned Ubuntu image.
- `.dockerignore` keeps the Docker build context small. Because Compose builds from this folder, the ignore file belongs here.
- `provision.sh` configures Ubuntu package sources, installs OS packages, installs Node.js, and creates the app startup command.
- `docker-compose.yml` mounts the app into `/var/www/app`, keeps `node_modules` and `.next` in Docker volumes, exposes port `3000`, and starts the app.

## Required Environment

Create `repairshop/.env.production` before starting the container. The Compose file treats this file as optional so `docker compose config` can still run before secrets exist, but the app needs the values at runtime. At minimum, set:

```env
DATABASE_URL=
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=
KINDE_POST_LOGOUT_REDIRECT_URL=
KINDE_POST_LOGIN_REDIRECT_URL=
```

Add any Sentry variables your deployment uses, such as `SENTRY_DSN` or source-map upload tokens, if needed.

## Deploy

From this folder:

```bash
docker compose up -d --build
docker compose logs -f repairshop
```

The app will be available on port `3000` by default. To expose a different host port:

```bash
APP_PORT=8080 docker compose up -d --build
```

## Runtime Flags

- `RUN_MIGRATIONS=1` runs `npm run db:migrate` before starting the app. Set it to `0` if you want to run migrations manually.
- `REBUILD_ON_START=1` runs `npm run build` whenever the container starts. Set it to `0` after a successful build if you want faster restarts.
- `NODE_VERSION=20.19.5` controls the Node.js version installed during image build.

## Notes

Ubuntu 16.04 is end-of-life, so `provision.sh` points APT to `old-releases.ubuntu.com`. Because this app uses a modern Next.js version, the script installs a Node.js 20 build compatible with older glibc from the Node.js unofficial builds project.
