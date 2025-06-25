# 🚀 TeamHub – A Collaborative Project Tracker

TeamHub is a lightweight, collaborative project management system — built to help teams manage projects, tasks, and members efficiently. Inspired by tools like Trello and Asana.

---

## 📦 Tech Stack
```
| **Layer** | **Tech**                                  |
|-----------|-------------------------------------------|
| Frontend  | React.js (Vite) + MUI + Styled-Components |
| Backend   | Express.js + Prisma ORM + PostgreSQL      |
| Auth      | JWT-based Auth with Auto Token Refresh    |
| Charts    | Recharts                                  |
| Styling   | MUI + Styled Components                   |
| Devops    | Docker + Docker Compose                   |
```
---

## 🧠 Features

- ✅ Login/Signup with JWT Auth
- ✅ Project Management
- ✅ Team Creation, Invites, Member Roles
- ✅ Task Assignment, Status Tracking, Comments
- ✅ Task History & Audit Trail
- ✅ Dynamic Dashboard (Stats + Charts)
- ✅ Protected Routes with Token Validation

---

## 📁 Project Structure

```
TeamHub/
├── teamhub-backend/
│ ├── Express.js
│ ├── Prisma
│ └── .env
├── teamhub-frontend/
│ ├── React.js
│ ├── Vite
│ ├── MUI
│ └── .env
├── docker-compose.yml
└── README.md
```

---

## 🧰 Prerequisites

- Node.js ≥ 18.x
- PostgreSQL (local or Docker)
- Docker & Docker Compose (if using containerized setup)
- npm or yarn

---

## ⚙️ Backend Setup (Manual)

```bash
cd teamhub-backend
``` 
##
## 1. Install Dependencies
```bash
npm install
```
##
## 2. ⚙️ Configure environment variables
```
cp .env.example .env
```
## 3. Update .env with:
```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
PORT=3000 
```
##
## 4. Run Migrations
```
npx prisma migrate dev --name init
```
##
## 5. Start backend server
```
npm run dev
```
---

## 💻 Frontend Setup (Manual)

## 1. Install dependencies
```
cd teamhub-frontend
npm install
```

##
## 2. Setup .env
```
cp .env.example .env
```
##
## 3. Update .env
```
VITE_BACKEND_BASE_URL=http://localhost:3000
```

##
## 4. Start dev server
```
npm run dev
```
---
## 🐳 Docker Setup (Recommended)
## 1. Clone Repository
For https:
```
git clone https://github.com/dhawanit/teamHub.git
``` 
For SSH:
```
git clone git@github.com:dhawanit/teamHub.git
```
---
## 2. Setup .env
> NOTE: Use this .env for docker setup only
```
cd teamhub-backend
cp .env.example .env
```
> Update .env
```
DATABASE_URL="postgresql://teamhub_user:test@postgres:5433/teamhub_db"
JWT_SECRET="nbd2j5jbwjkdk2j4bbk"
JWT_EXPIRES_IN="3600s"
PORT=3000
```
> Update .env in teamhub-frontend
```
cd teamhub-frontend
cp .env.example .env
```

## 3. One-click setup
```
docker-compose build
docker-compose up -d
```

---------------

## 4. Access URLs
**Frontend:** http://localhost:5173

**Backend:** http://localhost:3000

**PostgreSQL:** localhost:5432

✅ Make sure ports don’t conflict with any other app.

---
