# 🚀 Deployment Guide - EduNexus

## Problem: Blank Page on Netlify

Your page is blank because the frontend can't connect to the backend (localhost:5000 doesn't exist online).

## Solution: Deploy Backend First

### Step 1: Deploy Backend to Render (Free)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: `Sanketjadhav31/EduNexus`
5. Configure:
   - **Name:** edunexus-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

6. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=edunexus_secret_key_2024_super_secure
   CLOUDINARY_CLOUD_NAME=dtw7voynd
   CLOUDINARY_API_KEY=765458862826351
   CLOUDINARY_API_SECRET=WTMmAj_va4Zd_DPY3K2n4l8E7MU
   FRONTEND_URL=https://your-netlify-url.netlify.app
   ```

7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL (e.g., `https://edunexus-backend.onrender.com`)

### Step 2: Update Netlify Environment Variables

1. Go to Netlify Dashboard
2. Click your site → "Site settings" → "Environment variables"
3. Add these variables:
   ```
   VITE_API_URL=https://edunexus-backend.onrender.com/api
   VITE_SOCKET_URL=https://edunexus-backend.onrender.com
   ```

4. Go to "Deploys" → "Trigger deploy" → "Clear cache and deploy"

### Step 3: Update Backend CORS

Your backend needs to allow Netlify URL. Update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-netlify-url.netlify.app'
  ],
  credentials: true
}));
```

---

## Quick Fix for Local Testing

If you just want to test locally:

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open http://localhost:5173

---

## Alternative: Deploy Both to Render

### Backend:
- Follow Step 1 above

### Frontend:
1. Create another Web Service on Render
2. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`
3. Add environment variables (same as Netlify)

---

## Troubleshooting

### Blank Page Issues:

1. **Check Browser Console** (F12)
   - Look for errors
   - Check if API calls are failing

2. **Check Network Tab**
   - See if requests are going to correct URL
   - Check for CORS errors

3. **Verify Environment Variables**
   - Make sure `VITE_API_URL` is set correctly
   - Must start with `https://` for production

4. **Check Backend Logs**
   - Go to Render dashboard
   - Click "Logs" to see errors

### Common Errors:

**"Failed to fetch"**
- Backend not deployed or crashed
- Wrong API URL in environment variables

**"CORS Error"**
- Backend CORS not configured for frontend URL
- Add frontend URL to CORS whitelist

**"Cannot read properties of undefined"**
- API response format changed
- Check backend is returning correct data

---

## Environment Variables Summary

### Backend (.env):
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=dtw7voynd
CLOUDINARY_API_KEY=765458862826351
CLOUDINARY_API_SECRET=WTMmAj_va4Zd_DPY3K2n4l8E7MU
FRONTEND_URL=https://your-frontend-url.netlify.app
```

### Frontend (.env):
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

---

## Testing Deployment

1. Open your Netlify URL
2. Click "Instructor" demo login button
3. If it works → ✅ Success!
4. If blank → Check console for errors

---

## Need Help?

1. Check browser console (F12)
2. Check Render backend logs
3. Verify all environment variables are set
4. Make sure MongoDB is accessible from Render

---

**Remember:** Free tier on Render sleeps after 15 minutes of inactivity. First request may take 30-60 seconds to wake up!
