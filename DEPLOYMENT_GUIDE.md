# Hostinger Deployment Guide
## Domain: Namecheap | Hosting: Hostinger

## ✅ Pre-Deployment Checklist

Your project is now ready for Hostinger deployment with these updates:
- ✅ Backend configured to serve frontend in production
- ✅ .env.production file created
- ✅ Build scripts ready
- ✅ Domain: workiehq.com (Namecheap)
- ✅ Hosting: Hostinger

## 📦 Step 1: Build Your Project Locally

```bash
# Build the frontend
npm run build

# This creates a 'dist' folder with your compiled React app
```

## 🗂️ Step 2: Prepare Files for Upload

**What to Upload:**
- ✅ `dist/` folder (frontend build)
- ✅ `server/` folder (backend code)
- ✅ `package.json` and `package-lock.json`
- ✅ `.env.production` file (rename to `.env` on server)
- ✅ `uploads/` folder structure (create empty folder on server)

**What NOT to Upload:**
- ❌ `node_modules/` (will install on server)
- ❌ `.git/`
- ❌ `src/` (already compiled in dist)
- ❌ Local `.env` file

## 🔗 Step 3: Connect Namecheap Domain to Hostinger

### A. Get Hostinger Nameservers

1. Login to Hostinger: https://hpanel.hostinger.com
2. Go to **5: Upload Files to Hostinger

### Method A: File Manager (Easier)

1. In hPanel → **File Manager** (or **Files**)
2. Navigate to `public_html/` directory
3. Upload files:
   - Create a subfolder (optional): `workieblog` or use root `public_html`
   - Zip your project locally (excluding node_modules)
   - Upload the ZIP file using File Manager
   - Right-click → **Extract** the ZIP file
4. Upload `.env.production` and rename it to `.env`

### Method B: FTP (Recommended for Large Files)

1. In hPanel → **Files** → **FTP Accounts**
2. Get your FTP credentials or create new FTP user
3. Download FileZilla: https://filezilla-project.org/
4. Connect using:
   ```
   Host: ftp.workiehq.com (or IP from Hostinger)
   Username: your-ftp-username
   Password: your-ftp-password
   Port: 21
   ```
5. Upload files to `/public_html/`rking.com
   ```
6. Click **Save** (takes 24-48 hours to propagate, usually faster)

## 🌐 Step 4: Login to Hostinger hPanel

1. Go to: https://hpanel.hostinger.com
2. Login with your Hostinger credentials
3. Select your hosting plan

## 📤 Step 4: Upload Files

### Method A: File Manager (Easier)

1. In cPanel → **File Manager**
2. Navigate to your home directory (usually `/home/yourusername/`)
3. Create a new folder for your app (e.g., `workieblog`)
4. Upload files:
   - Zip your project locally (excluding node_modules)
   - Upload the ZIP file
   - Extract in File Manager
5. Upload `6: Setup Node.js Application in Hostinger

1. In hPanel → **Advanced** → **Node.js**
2. Click **"Create Application"** or **"Setup Node.js App"**
3. Configure:

   ```
   Node.js version: 18.x or 20.x (latest available)
   Application mode: Production
   Application root: /public_html/server (or /domains/workiehq.com/public_html/server)
   Application URL: https://workiehq.com
   Application startup file: index.ts
   ```

4. Click **"Create"** or **"Add Application"**

**Note:** Hostinger's path structure:
- Usually: 7: Configure Environment Variables

In the Node.js Application page:

1. Click **"Edit"** or **"Environment Variables"** for your app
2. Add each variable from `.env.production` one by one
   Passenger log file: logs/passenger.log
   ```

4. Click **"Create"**

## 🔧 Step 6: Configure Environment Variables

In the Node.js App page:

1. Click **"Environment variables"** for your app
2. Add each variable from `.env.production`:

   ```
   NODE_ENV = production
   PORT = 3001
   MONGODB_URI = mongodb+srv://all-data:rPxcDjkVSUm8uc8K@cluster0.gqatlzi.mongodb.net/workieblog
   MONGODB_DB_NAME = workieblog
   VITE_FIREBASE_API_KEY = AIzaSyDwMBf_gwGjSau7zJKp-bqQ06DAJbt-owo
   VITE_FIREBASE_AUTH_DOMAIN = workie-83970.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = workie-83970
   VITE_FIREBASE_STORAGE_BUCKET = workie-83970.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID = 129127063294
   VITE_FIREBASE_APP_ID = 1:129127063294:web:054f728c60c6f97699cfaf
   VITE_FIREBASE_MEASUREMENT_ID = G-30FNE0Z8SD
   FIREBASE_ADMIN_PROJECT_ID = workie-83970
   FIREBASE_ADMIN_PRIVATE_KEY = (paste the entire private key)
   FIREBASE_ADMIN_CLIENT_EMAIL = firebase-adminsdk-fbsvc@workie-83970.iam.gserviceaccount.com
   PAYPAL_CLIENT_ID = (your PayPal client ID)
   PAYPAL_CLIENT_SECRET = (your PayPal secret)
   PAYPAL_MODE = sandbox
   PAYSTACK_SECRET_KEY = (your Paystack key)
   PAYSTACK8: Install Dependencies

### Method A: Using hPanel Interface
1. In the Node.js App page, click **"Run npm install"** button
2. Wait for installation to complete

### Method B: Using SSH Terminal (Recommended)
1. In hPanel → **Advanced** → **SSH Access**
2. Enable SSH and note your credentials
3. Connect 9: Start Your Application

1. In the Node.js App page, click **"Start Application"** or **"Restart"**
2. Status should show: **"Running"** or green indicator
3. Check the logs if there are errors (click "View Logs")
4. Navigate to your app:
   ```bash
   cd domains/workiehq.com/public_htmlick **"Run NPM Install"**
2. Or use Terminal in cPanel:
   ```bash10: Configure Your Domain

Your domain (workiehq.com) should already be pointing to Hostinger after DNS propagation.

### Point Domain to Your Application

1. In hPanel → **Domains**
2. Click on **workiehq.com**
3. Verify Document Root points to: `/domains/workiehq.com/public_html/dist`
4. The Node.js app should handle API requests at `/api/*`

### Setup SSL (HTTPS)

1. In hPanel1: Create Uploads Directory

```bash
# Via SSH Terminal
cd domains/workiehq.com/public_html
mkdir -p uploads
chmod 755 uploads
```

Or via File 2: Configure MongoDB Atlas

1. Get your Hostinger server IP:
   - In hPanel → **Hosting** → Your plan → View server IP
   - Or check via SSH: `curl ifconfig.me`
2. Go to MongoDB Atlas → **Network Access**
3. Click **"Add IP Address"**
4. Add your Hostinger server IP
5. Or use **"Allow Access from Anywhere"** (0.0.0.0/0) - easier but
### For Subdomain (app.yourdomain.com):

1. cPanel → **Subdomains** → Create New
2. Subdomain: `app`
3. Document Root: `/home/yourusername/workieblog/dist`

## 📁 Step 10: Create Uploads Directory

```bash
# In cPanel3: Test Your Deployment

Wait for DNS propagation (check at https://dnschecker.org with workiehq.com)

Visit your domain: `https://workiehq
chmod 755 uploads
```

## 🔒 Step 11: Configure MongoDB Atlas

1. Go to MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Add your server's IP address (get from cPanel or contact support)
4. Or use **"Allow Access from Anywhere"** (0.0.0.0/0) - less secure

## ✅ Step 12: Test Your Deployment

Visit your domaihPanel → Node.js → Your App → View Logs
- Verify all environment variables are set correctly
- Check Node.js version compatibility (use 18.x or 20.x)
- SSH into server and run `npm install --production` again
- Verify paths are correct (Hostinger uses `/domains/workiehq.com/public_html/`)
- [ ] Login/Register works
- [ ] Admin dashboard accessible
- [ ] Firebase authentication works
- [ ] API calls succeed
- [ ] File uploads work
- [ ] Payment integration (if applicable)

## 🐛 Troubleshooting

### Issue: "Application failed to start"
**Solution:**
- Check logs in Node.js App section
- Verify all environment variables are set
- Check Node.js version compatibility
- SSH into Hostinger server
- Navigate to server directory: `cd domains/workiehq.com/public_html`
- Run: `npm install --production`
- Restart the application from hPanel

### Issue: "Cannot find server directory"
**Solution:**
- Verify your path in Hostinger (check File Manager for exact path)
- Common paths:
- Verify DNS has propagated (use https://dnschecker.org)
- Check SSL is installed properly

### Issue: "DNS not propagating"
**Solution:**
- Wait 24-48 hours for full DNS propagation
- Clear your browser cache
- Try accessing via incognito/private mode
- Check DNS status at https://dnschecker.org
- VhPanel → Advanced → Node.js → Your App
2. Click **"View Logs"** or **"Error Log"**

**Restart Application:**
1. hPanel → Node.js → Click **"Restart"** button

**Check Status:**
1. Visit: `https://workiehq.com/api/health`
2. Should return: `{"status":"ok","message":"Server is running"}`

**SSH Access for Debugging:**
```bash
# Connect via SSH
ssh u123456789@your-hostinger-ip

# Check Node.js processes
ps aux | grep node

# View real-time logs
tail -f domains/workiehq.com/logs/error.log
``
### Issue: "404 Not Found" on routes
**Solution:**
- Verify document root points to `/dist` folder
- Check .htaccess file existsHostinger via FTP or File Manager
# Or use Git deployment if configured

# Via SSH on Hostinger
ssh u123456789@your-server-ip
cd domains/workiehq.com/public_html
npm install --production
# Restart app from hPanel Node.json`
- Restart the application
 Resources

If you encounter issues:
1. Check hPanel error logs (Advanced → Error Logs)
2. Check Node.js application logs (Node.js → View Logs)
3. Hostinger Knowledge Base: https://support.hostinger.com
4. Hostinger Live Chat Support (24/7)
5. Verify MongoDB Atlas connection and IP whitelist
6. Check Firebase console for authentication issues
7. DNS checker: https://dnschecker.org

## 🔑 Quick Reference

**Hostinger Login:** https://hpanel.hostinger.com  
**Domain:** workiehq.com (Namecheap)  
**Hosting:** Hostinger  
**SSL:** Free (via Hostinger)  Hostinger deployment with your Namecheap domain. Follow the steps above carefully and your app will be live on https://workiehq.com!

### Summary Checklist:
- [ ] Connect Namecheap domain to Hostinger (update nameservers)
- [ ] Upload files to Hostinger (dist/, server/, package.json, .env)
- [ ] Setup Node.js app in hPanel
- [ ] Configure environment variables
- [ ] Install dependencies via SSH or hPanel
- [ ] Start the application
- [ ] Setup SSL certificate
- [ ] Whitelist Hostinger IP in MongoDB Atlas
- [ ] Test: https://workiehq.com/api/health
- [ ] Test: https://workiehq.com (full site)
**FTP:** ftp.workiehq.com  
**Node.js Path:** `/domains/workiehq.com/public_html/`

**View Application Logs:**
1. cPanel → Node.js App → Click on your app
2. View **"Application Logs"**

**Restart Application:**
1. Node.js App → Click **"Restart"**

**Check Status:**
1. Visit: `https://yourdomain.com/api/health`
2. Should return: `{"status":"ok","message":"Server is running"}`

## 🔄 Updating Your Application

When you make changes:

```bash
# Local machine
npm run build
git push

# Upload new dist/ and server/ files to cPanel
# Or use Git deployment if configured

# In cPanel
cd /home/yourusername/workieblog
npm install
# Restart app from Node.js App interface
```

## 📞 Support

If you encounter issues:
1. Check cPanel error logs
2. Check Node.js application logs
3. Contact Namecheap support for server-specific issues
4. Verify MongoDB Atlas connection
5. Check Firebase console for authentication issues

---

## 🎉 You're Ready!

Your project is now prepared for Namecheap cPanel deployment. Follow the steps above carefully and your app will be live!
