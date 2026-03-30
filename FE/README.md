🚀 Project Management App (Full-Stack)
This is a full-stack project management application built using a Turborepo monorepo architecture.

It includes:

🧠 Backend (NestJS + Supabase Auth)
🎨 Frontend (Next.js)
📦 Shared monorepo tooling (Turbo, TypeScript, ESLint)
📁 Project Structure
root/
  BE/
    apps/
      backend/        → NestJS API
  apps/
    web/              → Next.js frontend
  packages/
    ui/               → Shared UI components
⚙️ Prerequisites
Node.js ≥ 18
npm / pnpm installed
Supabase project configured (for auth)
🔥 Backend Setup (MANDATORY)
Backend must be started first.

cd BE/apps/backend
npm install
npm run dev
📍 Backend runs on:

http://localhost:5050
🎨 Frontend Setup
In a new terminal:

cd apps/web
npm install
npm run dev
📍 Frontend runs on:

http://localhost:3000
🔗 Environment Variables
Backend (BE/apps/backend/.env)
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
PORT=5050
Frontend (apps/web/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5050
🔐 Authentication Notes
Uses Supabase Auth

For development:

Disable email confirmation in Supabase
Backend handles JWT validation

🧪 Running Full Project (Optional - Turborepo)
From root:

npm install
npm run dev
Or with pnpm:

pnpm install
pnpm dev
📌 Features
✅ Projects
Create, update, delete projects
View all projects (latest first)
✅ Tasks
Create tasks inside projects

Filter by:

Status
Priority
Due date
Mark tasks as done

Prevent editing completed tasks

✅ UI/UX
Clean card-based layout
Responsive design
Disabled states for completed tasks
⚡ Tech Stack
Frontend
Next.js (App Router)
Tailwind CSS
Backend
NestJS
Supabase Auth
Dev Tools
Turborepo
TypeScript
ESLint + Prettier
🚀 Production Notes
Before deploying:

Enable email confirmation in Supabase
Use environment-based API URLs
Secure backend routes with guards
Add rate limiting
🧩 Future Improvements
🔄 React Query / SWR for data fetching
🧠 Global state (Zustand)
🔐 Refresh tokens
📊 Analytics dashboard
👥 Team collaboration
👨‍💻 Author
Built as a full-stack assignment project.
