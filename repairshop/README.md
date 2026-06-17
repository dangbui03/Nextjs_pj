# 🛠️ RepairShop

A modern, full-stack Repair Shop Management Application built with **Next.js 16 (Turbopack)**, **React 19**, **Drizzle ORM**, **Neon PostgreSQL**, **Kinde Authentication**, and **Sentry**. 

This system helps managers and technicians track customer profiles, manage support/repair tickets, and run daily shop operations seamlessly.

---

## ✨ Features & Technology Stack

### 🚀 Key Features
- **🔑 Secure Authentication**: Seamless login and logout flow powered by **Kinde Auth**.
- **👥 Customer Management**: Create, edit, and view detailed customer profiles.
- **🎫 Ticket Tracking**: Create and update repair/support tickets, assign to technicians, track progress statuses (Open, In Progress, Resolved), and mark urgency levels.
- **📊 Interactive Tables**: Advanced data tables for tickets and customers utilizing **TanStack Table** with search filters, pagination, and sorting capabilities.
- **🚨 Error Monitoring**: Live error tracking, diagnostics, and session monitoring using **Sentry**.
- **🎨 Modern Responsive UI**: Beautifully designed dark-mode friendly user interface utilizing **Tailwind CSS**, **Radix UI**, and custom transitions.

### 🛠️ Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Database**: [Neon Database](https://neon.tech/) (Serverless PostgreSQL)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle-Kit](https://orm.drizzle.team/kit-docs/overview)
- **Auth**: [Kinde Auth](https://kinde.com/)
- **Table System**: [TanStack Table v8](https://tanstack.com/table/v8)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod Schemas](https://zod.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/), Radix UI, Lucide Icons, and Sonner Toast Notifications
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Monitoring**: [Sentry](https://sentry.io/) & Vercel Analytics

---

## 💻 Getting Started & Local Setup

Follow these steps to set up and run the project locally.

### 📋 Prerequisites
- **Node.js**: `v20.x` or higher
- **pnpm**: `v10.34.3` or higher (To install globally, run `npm i -g pnpm`)

---

### 🗂️ Step-by-Step Installation

#### 1. Clone the repository and navigate to the folder
```bash
git clone <repository-url>
cd repairshop
```

#### 2. Install Dependencies
Install all package dependencies using pnpm:
```bash
pnpm install
```

#### 3. Set Up Environment Variables
Create a copy of `.env.example` named `.env.local`:
```bash
cp .env.example .env.local
```
Then, fill in the actual keys for the following configuration blocks:
* **Neon PostgreSQL URL**: Grab your connection string from the [Neon Console](https://console.neon.tech/).
* **Kinde Auth Keys**: Get these from your [Kinde Dashboard](https://kinde.com/) by creating a new Next.js application. Make sure to whitelist the redirects (`/api/auth/kinde_callback`, `/login`, `/home`).
* **Sentry Auth Token**: Create an integration token in your [Sentry Settings](https://sentry.io/).

#### 4. Database Setup & Migrations
Before starting the application, synchronize your database schema using Drizzle:

* **Generate Database Migrations**:
  ```bash
  pnpm db:generate
  ```
* **Apply Migrations to Neon Database**:
  ```bash
  pnpm db:migrate
  ```

#### 5. Launch the Development Server
Run the local next.js development server:
```bash
pnpm dev
```
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)** to view the application!

---

## 🛠️ Available Scripts

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts the Next.js development server with Turbopack |
| `pnpm build` | Compiles the production bundle |
| `pnpm start` | Launches the compiled production server |
| `pnpm lint` | Runs ESLint diagnostic checks across all files |
| `pnpm db:generate` | Generates Drizzle ORM SQL migration schemas |
| `pnpm db:migrate` | Executes migration scripts to synchronize the Neon database |

---

## 📈 Deployment

To deploy the application to production:

1. **Vercel Deployment**: Link your project to Vercel and import your environment variables.
2. **Neon DB Integration**: Ensure your Neon production cluster is set up and referenced by your environment variables.
3. **Sentry Release Tracking**: The build process automatically compiles source maps and uploads them to Sentry for exact line tracking.
