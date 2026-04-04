# Sree Gajananan Catering Management System

A full-stack catering management system built with React (Frontend) and Node.js/Express (Backend).

## Deployment Guide

Follow these steps to deploy the application.

### 1. Database Setup (MongoDB Atlas)
1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Shared/Free).
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. Under **Database Access**, create a user with a username and password.
5. Click **Connect** -> **Connect your application** and copy the Connection String.
   - It should look like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/catering_db?retryWrites=true&w=majority`

---

### 2. Backend Deployment (Render)
1. Push your code to a GitHub repository.
2. Sign up/Login to [Render](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name**: `catering-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click **Advanced** and add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string (e.g., `your_very_secret_key_123`).
   - `PORT`: `5000` (Render handles this, but good to set).
7. Click **Create Web Service**.
8. **Note the URL** provided by Render (e.g., `https://catering-backend.onrender.com`).

---

### 3. Frontend Deployment (Vercel)
1. Sign up/Login to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Connect your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Environment Variables** and add:
   - `VITE_API_URL`: The URL of your Render backend (with NO trailing slash).
     - Example: `https://catering-backend.onrender.com`
6. Click **Deploy**.

---

### 4. Final Verification
1. Once both are deployed, open your Vercel URL.
2. Login with your admin credentials (default: `admin` / `admin_password_123`).
3. Verify that you can create, edit, and delete events.

## Local Development
1. Clone the repository.
2. Backend: `cd backend && npm install && npm run dev`
3. Frontend: `cd frontend && npm install && npm run dev`
