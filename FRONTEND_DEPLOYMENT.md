# Frontend-Only Deployment on Render

## Configuration Summary

The `render.yaml` is now configured for **frontend-only deployment**:

- **Service**: `syncup-frontend` (Next.js)
- **Root Directory**: `frontend/`
- **Build**: `npm install && npm run build`
- **Start**: `npm start`
- **Environment Variables**: Pre-configured

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Commit changes**:
   ```bash
   git add render.yaml
   git commit -m "Update: Frontend-only deployment configuration"
   git push origin main
   ```

2. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +" → "Blueprint"**
   - Select your GitHub repository
   - Click **"Create Blueprint"**
   - Render detects `render.yaml` and deploys automatically

3. **Wait for deployment** (5-10 minutes)
   - Status will show "Deployed" when complete
   - Your frontend URL: `https://syncup-frontend-xxxx.onrender.com`

### Option 2: Manual Setup (Without render.yaml)

1. **Create Web Service**:
   - Render Dashboard → **"New +" → "Web Service"**
   - Select your GitHub repository

2. **Configure Service**:
   - **Name**: `syncup-frontend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `frontend` (important!)

3. **Add Environment Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://syncup-assignment-2.onrender.com/
   NEXT_PUBLIC_SUPABASE_URL=https://uedtvttusnvdcusjkiai.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_vlvgAtKFv3q6a31XDkGDRQ_3I3CKQHS
   ```

4. **Deploy**: Click **"Create Web Service"**

## Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Production mode |
| `NEXT_PUBLIC_API_URL` | `https://syncup-assignment-2.onrender.com/` | Backend API URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://uedtvttusnvdcusjkiai.supabase.co` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_vlvgAtKFv3q6a31XDkGDRQ_3I3CKQHS` | Supabase Key |

## Troubleshooting

### Build fails with "Cannot find module"
- Ensure build command includes: `npm install && npm run build`
- Check that Next.js dependencies are in `frontend/package.json`

### Frontend shows blank page
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Ensure backend API is accessible and running

### API calls fail with CORS error
- The backend must have `CORS_ORIGIN` set to your frontend URL
- Frontend URL format: `https://syncup-frontend-xxxx.onrender.com`

### Slow cold starts
- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes 10-30 seconds

## Accessing Your Frontend

After successful deployment:

```
https://syncup-frontend-xxxx.onrender.com
```

Replace `xxxx` with your actual service ID from Render Dashboard.

## Updating the Frontend

Any push to your main branch will automatically redeploy:

1. Make changes locally
2. Commit and push to GitHub
3. Render automatically rebuilds and deploys
4. New version live in 2-5 minutes

## Notes

- The frontend-only setup assumes your backend is already deployed separately
- Update `NEXT_PUBLIC_API_URL` if your backend changes
- All `NEXT_PUBLIC_*` variables are visible in browser (don't put secrets here)
- Secrets should be stored in `.env` file locally, not in code
