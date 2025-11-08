# ⚠️ Cloudinary Credentials Issue

## The Problem
Your Cloudinary test is failing with "Error: undefined"

This means your credentials are **INCORRECT**.

## How to Fix

### Step 1: Go to Cloudinary Dashboard
Visit: https://console.cloudinary.com/

### Step 2: Find Your Credentials
On the dashboard, you'll see:

```
Cloud name: ____________
API Key: ____________
API Secret: ____________
```

### Step 3: Update backend/.env

Replace with YOUR actual credentials:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**IMPORTANT:** 
- Cloud name should NOT have "API" at the end
- Copy EXACTLY as shown in dashboard
- No spaces, no quotes

### Step 4: Restart Backend

```bash
# Stop backend (Ctrl+C)
cd backend
npm start
```

### Step 5: Test Again

```bash
node backend/test-cloudinary.js
```

You should see: ✅ Cloudinary connection successful!

---

## Alternative: Use YouTube for Videos

If Cloudinary is too complicated, just use YouTube URLs:

1. Upload video to YouTube
2. Copy the URL
3. Paste in "OR" section when adding lecture
4. No Cloudinary needed!

Example:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

This is **MUCH EASIER** and has no limits! 🚀
