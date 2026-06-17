#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

NODE_VERSION="${NODE_VERSION:-20.19.5}"
NODE_DISTRO="${NODE_DISTRO:-linux-x64}"
NODE_ARCHIVE="node-v${NODE_VERSION}-${NODE_DISTRO}.tar.xz"
NODE_BASE_URL="${NODE_BASE_URL:-https://nodejs.org/dist}"
NODE_URL="${NODE_BASE_URL}/v${NODE_VERSION}/${NODE_ARCHIVE}"

apt-get update
apt-get install -y --no-install-recommends \
  bash \
  ca-certificates \
  curl \
  xz-utils \
  git \
  tini \
  build-essential \
  python3 \
  pkg-config

curl -fsSL "$NODE_URL" -o "/tmp/${NODE_ARCHIVE}"
mkdir -p /usr/local/lib/nodejs
tar -xJf "/tmp/${NODE_ARCHIVE}" -C /usr/local/lib/nodejs
ln -sf "/usr/local/lib/nodejs/node-v${NODE_VERSION}-${NODE_DISTRO}/bin/node" /usr/local/bin/node
ln -sf "/usr/local/lib/nodejs/node-v${NODE_VERSION}-${NODE_DISTRO}/bin/npm" /usr/local/bin/npm
ln -sf "/usr/local/lib/nodejs/node-v${NODE_VERSION}-${NODE_DISTRO}/bin/npx" /usr/local/bin/npx

# Install pnpm and create symlinks if needed
npm install -g pnpm@10.34.3
if [ -f "/usr/local/lib/nodejs/node-v${NODE_VERSION}-${NODE_DISTRO}/bin/pnpm" ]; then
  ln -sf "/usr/local/lib/nodejs/node-v${NODE_VERSION}-${NODE_DISTRO}/bin/pnpm" /usr/local/bin/pnpm
fi

npm config set update-notifier false
npm config set fund false
npm config set audit false

mkdir -p /var/www/app

cat > /usr/local/bin/start-repairshop <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

cd /var/www/app

if [ ! -f package.json ]; then
  echo "package.json was not found in /var/www/app. Check the docker-compose volume mount." >&2
  exit 1
fi

export NODE_ENV="${NODE_ENV:-production}"
export NEXT_TELEMETRY_DISABLED="${NEXT_TELEMETRY_DISABLED:-1}"
export PORT="${PORT:-3000}"

# Run pnpm install if node_modules is missing or pnpm-lock.yaml is newer
if [ ! -d node_modules ] || [ pnpm-lock.yaml -nt node_modules/.pnpm-lock.yaml ]; then
  pnpm install --frozen-lockfile
  touch node_modules/.pnpm-lock.yaml
fi

if [ "${RUN_MIGRATIONS:-1}" = "1" ]; then
  pnpm run db:migrate
fi

if [ "${REBUILD_ON_START:-1}" = "1" ] || [ ! -f .next/BUILD_ID ]; then
  pnpm run build
fi

exec /usr/bin/tini -- pnpm run start -- -H 0.0.0.0 -p "$PORT"
EOF

chmod +x /usr/local/bin/start-repairshop

apt-get clean
rm -rf /var/lib/apt/lists/* /tmp/*
