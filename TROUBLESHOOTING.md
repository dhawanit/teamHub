## 🔧 Common Issues & Fixes
```
|--------------------|-------------------------------------------|
| **Issue**          | **Fix**                                   |
|--------------------|-------------------------------------------|
| Frontend           | React.js (Vite) + MUI + Styled-Components |
| Backend            | Express.js + Prisma ORM + PostgreSQL      |
| Authentication     | JWT-based Auth with Auto Token Refresh    |
| Charts Integration | Recharts                                  |
| Styling Framework  | MUI + Styled Components                   |
| DevOps / Deployment| Docker + Docker Compose                   |
|--------------------|-------------------------------------------|
```
---
## ⚠️ Troubleshooting Issues

```
|----------------------|------------------------------------------------------------------------|
| **Issue**            | **Fix**                                                                |
|----------------------|------------------------------------------------------------------------|
| Port already in use  | the ports in *.env* or docker-compose.yaml to free ports               |
| Prisma migrate errors| Verify DB credentials and ensure the database exists                   |
| Blank React page     | Check .env for correct base URL and inspect browser console errors     |
| JWT expired          | Re-login to refresh token; implement token auto-refresh logic if needed|
|----------------------|------------------------------------------------------------------------|
```
