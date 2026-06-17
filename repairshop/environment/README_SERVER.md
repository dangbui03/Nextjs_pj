# Server Deployment Guide for RepairShop (Next.js)

This guide provides instructions for deploying and hosting the RepairShop Next.js application on your own Linux server. It supports **Ubuntu Server**, **Ubuntu Desktop**, and **Arch Linux** (including **Omarchy**).

You can deploy the application using either **Docker Compose (Recommended)** or **Native (Bare Metal)** setup.

---

## Prerequisites & Configuration

Before deploying, prepare the environment configurations. The application depends on **Neon PostgreSQL** and **Kinde Authentication**.

### 1. Kinde Configuration
Ensure your Kinde Application has the correct URLs configured in the Kinde dashboard:
- **Allowed Callback URLs**: `http://<your-server-ip-or-domain>:<port>/api/auth/kindeAuth`
- **Allowed Logout Redirect URLs**: `http://<your-server-ip-or-domain>:<port>/login`
- **Allowed Web Origins / Post Login Redirect URLs**: `http://<your-server-ip-or-domain>:<port>/home`

### 2. Environment Variables
You will need to define a single configuration file.
- If using Docker: Create `environment/.env` (or copy `.env.example` to `repairshop/.env.production`).
- If using Native Setup: Create a `.env.local` or `.env` file in the project root folder.

#### Variable Reference:
```env
# Expose the server URL (Kinde redirect URLs will automatically construct using this base)
APP_URL=http://<your-server-ip-or-domain>:<port>

# Kinde Secrets
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=https://your-domain.kinde.com
KINDE_DOMAIN=https://your-domain.kinde.com
KINDE_MANAGEMENT_CLIENT_ID=your_kinde_management_client_id
KINDE_MANAGEMENT_CLIENT_SECRET=your_kinde_management_client_secret

# Database Configuration (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname/dbname?sslmode=require"

# Sentry (Optional)
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

---

## Option A: Docker Compose Deployment (Recommended)

Docker Compose containerizes the application, ensuring it runs identically on **Ubuntu Server**, **Ubuntu Desktop**, and **Arch Linux / Omarchy** without worrying about conflicting local Node.js versions or system dependencies.

### Step 1: Install Docker and Docker Compose
Choose your host Linux distribution:

#### On Ubuntu Server & Ubuntu Desktop:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
# Log out and log back in for group membership to take effect
```

#### On Arch Linux / Omarchy:
```bash
sudo pacman -Syu
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
# Log out and log back in for group membership to take effect
```

### Step 2: Configure Environment
In the `environment` directory, create a `.env` file:
```bash
nano environment/.env
```
Paste the configuration variables (described in the Prerequisites section) and save.

### Step 3: Launch the App
Run the following commands from the `environment/` directory:
```bash
# Build and start container in detached mode
docker compose up -d --build

# View build and runtime logs
docker compose logs -f repairshop
```

### Step 4: Verify Deployment
The container will launch, run database migrations automatically, compile Next.js production bundles, and bind to host port `3000` (or `APP_PORT` if defined in environment).
Access the application at `http://your-server-ip:3000`.

---

## Option B: Native Setup (Bare Metal / Systemd)

If you prefer to run the application directly on the host OS, follow the steps below.

### Step 1: Install Node.js & PNPM
Choose your host Linux distribution to set up Node.js v20+ and `pnpm`.

#### On Ubuntu Server & Ubuntu Desktop:
```bash
# Install NodeSource Node.js 20 LTS repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential

# Verify versions
node -v
npm -v

# Install pnpm globally
sudo npm install -g pnpm@10.34.3
```

#### On Arch Linux / Omarchy:
```bash
# Install Node.js using pacman
sudo pacman -Syu
sudo pacman -S nodejs npm base-devel

# Verify versions
node -v
npm -v

# Install pnpm globally
sudo npm install -g pnpm@10.34.3
```

### Step 2: Prepare the Workspace
Clone/move your project folder, navigate into it, and setup the environment file.
```bash
cd /var/www/repairshop # or your chosen directory

# Create production env file in project root
nano .env
```
Paste all environment variables. Make sure `KINDE_SITE_URL` and redirect URLs are explicitly set if not using the dynamic Docker compose resolver:
```env
KINDE_SITE_URL=http://your-server-ip:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://your-server-ip:3000/login
KINDE_POST_LOGIN_REDIRECT_URL=http://your-server-ip:3000/home
DATABASE_URL="..."
...
```

### Step 3: Install Dependencies & Build
Install all dependencies using lockfile constraints, run migrations, and build Next.js for production:
```bash
# Install dependencies
pnpm install --frozen-lockfile

# Run database migrations
pnpm run db:migrate

# Build Next.js
pnpm run build
```

### Step 4: Set up Service Manager
To run the server continuously in the background and survive reboots, choose `Systemd` or `PM2`.

#### Method 1: Using Systemd (Recommended for Production)
Create a new systemd service file:
```bash
sudo nano /etc/systemd/system/repairshop.service
```

Add the following configuration (adjust User, WorkingDirectory, and paths):
```ini
[Unit]
Description=RepairShop Next.js Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/repairshop
ExecStart=/usr/bin/pnpm run start
Restart=always
Environment=NODE_ENV=production PORT=3000

[Install]
WantedBy=multi-user.target
```

Reload daemon, enable, and start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable repairshop
sudo systemctl start repairshop

# Check status and logs
sudo systemctl status repairshop
journalctl -u repairshop -n 50 -f
```

#### Method 2: Using PM2
```bash
sudo npm install -g pm2
pm2 start pnpm --name "repairshop" -- run start -- -p 3000
pm2 save
pm2 startup
```

---

## Setting up a Reverse Proxy (Nginx) with SSL
To access the server securely over HTTPS (port 443), set up Nginx as a reverse proxy.

### 1. Install Nginx & Certbot
```bash
# Ubuntu
sudo apt install -y nginx certbot python3-certbot-nginx

# Arch/Omarchy
sudo pacman -S nginx certbot certbot-nginx
```

### 2. Configure Nginx Server Block
Create configuration at `/etc/nginx/sites-available/repairshop` (or add to main `/etc/nginx/nginx.conf` on Arch):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activate and reload Nginx:
```bash
# Ubuntu
sudo ln -s /etc/nginx/sites-available/repairshop /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Arch
sudo systemctl restart nginx
```

### 3. Apply Let's Encrypt SSL Cert
```bash
sudo certbot --nginx -d your-domain.com
```
Certbot will configure SSL and redirect HTTP traffic to HTTPS automatically!
Make sure to update your `APP_URL` or `KINDE_SITE_URL` to `https://your-domain.com` in your environment files once HTTPS is active.
