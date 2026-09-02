# 🏡 Life Designer – Interior Design Website

A full-stack web application for an interior design service. Users can browse projects and submit enquiries. Admins can manage projects and leads through a protected dashboard.

---

## 🚀 Features

- Responsive public website to showcase interior & exterior design projects
- Project gallery with category filter and search
- Contact / lead capture form for visitors
- Admin dashboard (JWT-protected) to:
  - Add, edit, and delete projects with image uploads
  - View and manage leads submitted by visitors
- Image hosting via Cloudinary
- Auto-seeded admin account on first server start

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client |
| React Hook Form + Zod | Form handling & validation |
| Framer Motion | Animations |
| React Hot Toast | Notifications |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas + Mongoose | Database |
| JWT (jsonwebtoken) | Admin authentication |
| bcrypt | Password hashing |
| Multer + Cloudinary | Image upload & storage |
| dotenv | Environment config |

---

## 📂 Project Structure

```
life-desighner/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/          # Router & providers
│   │   ├── components/   # Reusable UI components
│   │   ├── layouts/      # AdminLayout, PublicLayout
│   │   ├── lib/          # Helpers (media URLs etc.)
│   │   ├── pages/        # Public & admin pages
│   │   ├── routes/       # RequireAdmin guard
│   │   ├── services/     # API calls (projects, auth, leads)
│   │   └── styles/
│   ├── .env              # VITE_API_URL
│   └── vercel.json       # SPA rewrite rule for Vercel
│
└── backend/
    ├── src/
    │   ├── config/       # env validation, cloudinary, db seed
    │   ├── controllers/  # authController
    │   ├── middleware/    # auth, upload, error handler
    │   ├── models/       # Admin, Project, Contact
    │   ├── routes/       # auth, projects, contacts
    │   └── server.js
    └── .env              # MONGO_URI, JWT_SECRET, ADMIN_*, CLOUDINARY_*
```

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/Aravinth466677/life-desighner.git
cd life-desighner
```

### 2. Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_secret
ADMIN_EMAIL=admin@lifedesigner.com
ADMIN_PASSWORD=your_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
# Server runs on http://localhost:5001
```

### 3. Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

```bash
npm run dev
# App runs on http://localhost:5173
```

> The admin account is auto-created on first server start using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

---

## ☁️ Deployment

### Frontend → Vercel
1. Import the `frontend/` folder into Vercel
2. Set environment variable: `VITE_API_URL=https://your-backend-url/api`
3. `vercel.json` already handles SPA routing

### Backend → Render
1. Create a new **Web Service** pointing to the `backend/` folder
2. Set **Start Command**: `npm start`
3. Add all environment variables from `backend/.env` in Render's dashboard

---

## 🔐 Admin Access

Navigate to `/admin/login` and sign in with the credentials set in your `.env`.
