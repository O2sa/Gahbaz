# Gahbaz (منصة جَهْبَذ) — Production Deployment Guide

This guide details the decoupled production deployment of **Gahbaz**:
- **Frontend SPA**: Deployed to [Netlify](https://www.netlify.com/) (Live: `https://gahbaz.netlify.app/`).
- **Backend API & Real-Time Server**: Deployed to [Render](https://render.com/) (API base: `https://elearningsystem.onrender.com` / `https://gahbaz-api.onrender.com`).
- **Object Storage**: [Wasabi Hot Cloud Storage](https://wasabi.com/) (or AWS S3 / Cloudinary).
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with multi-document ACID transactions.

---

## 1. Architectural Separation

The platform enforces **complete separation between frontend and backend**:
1. The backend API never serves frontend static assets in production.
2. The frontend is built as a pure Single-Page Application (SPA) with Netlify client-side rewrites (`/* /index.html 200`).
3. Cross-Origin Resource Sharing (CORS) and credentials are fully supported across custom domains.

---

## 2. Frontend Deployment on Netlify

### 2.1 Netlify Configuration File (`netlify.toml`)
The repository contains both a root `netlify.toml` and `client/netlify.toml`:
```toml
[build]
  base = "client"
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
Additionally, `client/public/_redirects` ensures that Vite builds include the redirect rule in the final output directory.

### 2.2 Frontend Environment Variables (Netlify Dashboard)
Configure the following in **Site Configuration > Environment Variables**:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the backend API (with trailing `/api/v1` or root) | `https://elearningsystem.onrender.com/api/v1` |
| `VITE_SOCKET_URL` | Socket.IO server host | `https://elearningsystem.onrender.com` |
| `VITE_GA_MEASUREMENT_ID` | Optional Google Analytics 4 Measurement ID | `G-P7SYZGRE0X` |

---

## 3. Backend Deployment on Render

### 3.1 Blueprint Specification (`render.yaml`)
Render deployment can be provisioned using the checked-in blueprint `render.yaml`:
```yaml
services:
  - type: web
    name: gahbaz-api
    runtime: node
    plan: starter
    rootDir: backend
    buildCommand: pnpm install
    startCommand: node server.js
    healthCheckPath: /health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_LIFETIME
        value: 7d
      - key: CLIENT_URL
        value: https://gahbaz.netlify.app
      - key: STORAGE_PROVIDER
        value: s3
      - key: S3_ENDPOINT
        value: https://s3.eu-central-2.wasabisys.com
      - key: S3_REGION
        value: eu-central-2
      - key: S3_BUCKET
        sync: false
      - key: S3_ACCESS_KEY_ID
        sync: false
      - key: S3_SECRET_ACCESS_KEY
        sync: false
    disk:
      name: uploads-data
      mountPath: /opt/render/project/src/backend/uploads
      sizeGB: 10
```

### 3.2 Backend Environment Variables Reference

| Category | Variable | Required | Description |
| :--- | :--- | :--- | :--- |
| **Server** | `PORT` | Yes | HTTP listening port (Default: `5000`) |
| **Server** | `NODE_ENV` | Yes | Set to `production` |
| **Server** | `CLIENT_URL` | Yes | Allowed frontend origin for CORS and cookies (`https://gahbaz.netlify.app`) |
| **Database** | `MONGO_URI` | Yes | MongoDB Atlas replica set connection string (requires transaction support) |
| **Security** | `JWT_SECRET` | Yes | Strong cryptographically secure random string |
| **Security** | `JWT_LIFETIME` | No | Lifetime of JWT tokens (Default: `7d`) |
| **Security** | `DEMO_MODE` | No | Set to `true` to block write operations on live demo accounts |
| **Storage** | `STORAGE_PROVIDER` | Yes | `s3` (for Wasabi / AWS), `cloudinary`, or `local` |
| **S3 / Wasabi** | `S3_ENDPOINT` | If S3 | e.g., `https://s3.eu-central-2.wasabisys.com` |
| **S3 / Wasabi** | `S3_REGION` | If S3 | Region string, e.g., `eu-central-2` |
| **S3 / Wasabi** | `S3_BUCKET` | If S3 | Wasabi or AWS S3 bucket name |
| **S3 / Wasabi** | `S3_ACCESS_KEY_ID` | If S3 | Storage Access Key ID |
| **S3 / Wasabi** | `S3_SECRET_ACCESS_KEY` | If S3 | Storage Secret Access Key |
| **Cloudinary** | `CLOUDINARY_CLOUD_NAME` | If Cloudinary | Cloudinary cloud identifier |
| **Cloudinary** | `CLOUDINARY_API_KEY` | If Cloudinary | Cloudinary API Key |
| **Cloudinary** | `CLOUDINARY_API_SECRET` | If Cloudinary | Cloudinary Secret Key |

### 3.3 Health Check Endpoints
Render and uptime monitoring services can use either of the following probes:
- `GET /health` -> `{ "status": "ok", "service": "gahbaz-api" }`
- `GET /api/v1/health` -> `{ "status": "ok", "service": "gahbaz-api", "timestamp": "..." }`
- `GET /api/v1/test` -> `{ "success": true, "data": { "status": "healthy" } }`

---

## 4. Seeding Demo Data in Production

To seed an initial institution, faculties, courses, assignments, student submissions, and transcripts:
```bash
# In backend directory
pnpm seed:full
```
Or create a custom Super Administrator account via CLI:
```bash
# In backend directory
node src/scripts/createSuperAdmin.js --name "مدير النظام" --email "admin@gmail.com" --password "admin123"
```
