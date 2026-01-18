# Cloudinary Setup Instructions

## Getting Your Cloudinary API Credentials

The image upload now uses secure server-side uploads. You need to add your Cloudinary API credentials to make it work.

### Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Sign in to your account (or create one if you don't have it)
3. On the dashboard homepage, you'll see your:
   - **Cloud Name**: `dlo01nlze` (already configured)
   - **API Key**: Copy this value
   - **API Secret**: Click "Show" then copy this value

### Step 2: Update Environment Variables

Update both `.env` and `.env.production` files with your actual credentials:

```env
# Cloudinary Configuration (For image uploads)
VITE_CLOUDINARY_CLOUD_NAME="dlo01nlze"
VITE_CLOUDINARY_UPLOAD_PRESET="ml_default"
CLOUDINARY_API_KEY="your_actual_api_key_here"
CLOUDINARY_API_SECRET="your_actual_api_secret_here"
```

**Important:** Replace `your_actual_api_key_here` and `your_actual_api_secret_here` with the real values from your Cloudinary dashboard.

### Step 3: Restart Your Server

After updating the environment variables:

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run server
```

### Step 4: Test the Upload

1. Go to Admin → Posts → Create/Edit
2. Click "Upload Image"
3. Select an image file
4. The image should upload successfully through the backend API

## Security Notes

- ✅ **Server-side uploads** are more secure than client-side uploads
- ✅ **API Secret** is never exposed to the browser
- ✅ **Signed requests** prevent unauthorized uploads
- ⚠️ **Never commit** your API credentials to Git (they're in .env files which are gitignored)

## Troubleshooting

If you get errors:
1. Make sure the API credentials are correct
2. Check that your Cloudinary account is active
3. Verify the server is running with the new environment variables
4. Check the browser console and server logs for detailed error messages
