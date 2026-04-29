# Quick-Start Guide: ROI Calculator Backend Setup

## What's Working ✅

The backend API is running and calculating ROI correctly:
- Input: task, industry, employees, hours/week, hourly rate
- Output: weeklyLoss, monthlyLoss, yearlyLoss, hoursPerYear

## What's Not Working Yet ⚠️

| Service | Status | Issue |
|---------|--------|-------|
| Email (Gmail) | Needs config | Invalid app password or SSL issue |
| Google Sheets | Needs config | Missing service account key |

---

## Step 1: Fix Gmail Email Sending

### Option A: Regenerate App Password (Recommended)

1. Go to https://myaccount.google.com/apppasswords
   - Sign in to `bayou.biz.25@gmail.com`
   - If prompted, complete 2FA verification

2. Create new app password:
   - Select app: **Mail**
   - Select device: **Windows Computer** (or Other)
   - Click **Generate**

3. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

4. Update `.env` file:
   ```
   GMAIL_APP_PASSWORD=paste-your-new-password-here
   ```

### Option B: Use SMTP with Less Secure Settings

If the app password still fails, update `server.js` transporter:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
```

---

## Step 2: Set Up Google Sheets Integration

### Step 2a: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **New Project** → Name it "Bayou Bros ROI"
3. Click **Create**

### Step 2b: Enable Google Sheets API

1. In the search bar, type "Google Sheets API"
2. Click **Enable**

### Step 2c: Create Service Account

1. In the left menu, go to **IAM & Admin** → **Service Accounts**
2. Click **+ CREATE SERVICE ACCOUNT**
3. Fill in:
   - Service account name: `roi-calculator`
   - Service account ID: `roi-calculator` (auto-filled)
   - Description: "For Bayou Bros ROI Calculator"
4. Click **CREATE AND CONTINUE** (skip the optional steps)
5. Click **DONE**

### Step 2d: Create and Download Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** → Click **Create**
5. The file downloads automatically

### Step 2e: Save the Key File

1. Move the downloaded JSON file to: `vite-react-main/service-account-key.json`
2. Update `.env`:
   ```
   GOOGLE_SERVICE_ACCOUNT_KEY=./service-account-key.json
   ```

### Step 2f: Share Your Google Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1RLsUZjqEcMdbpdV-wUn5u7NWXazSSCaZfYkOdfkEZJA
2. Click **Share** (top right)
3. Add the service account email from your JSON file:
   - Look for `client_email` in the JSON (looks like: `roi-calculator@bayou-bros-roi.iam.gserviceaccount.com`)
4. Set as **Editor** (not Viewer)
5. Click **Send**

---

## Step 3: Test the Complete Flow

### Restart the server:

```bash
cd vite-react-main
node server.js
```

### Test the API:

```bash
curl -X POST http://localhost:5000/api/calculate-roi ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"taskName\":\"Data Entry\",\"industry\":\"Accounting\",\"employees\":\"2\",\"hoursPerWeek\":\"10\",\"hourlyRate\":\"50\"}"
```

### Expected Response:

```json
{
  "success": true,
  "data": {
    "weeklyLoss": 1000,
    "monthlyLoss": 4330,
    "yearlyLoss": 51960,
    "hoursPerYear": 1040
  }
}
```

### Check Server Logs:

You should see:
- ✅ "Data saved to Google Sheets"
- ✅ "Email sent to: test@example.com"
- ✅ "PDF generated successfully"

---

## Troubleshooting

### "Invalid credentials" for Gmail
→ Your app password is wrong or expired. Regenerate at https://myaccount.google.com/apppasswords

### "Could not load the default credentials" for Sheets
→ Service account key file is missing or not shared with the sheet. Check Steps 2d-2f

### "self-signed certificate in certificate chain"
→ Corporate firewall or antivirus is intercepting SSL. Try:
```javascript
// In server.js, add this to transporter:
tls: {
  rejectUnauthorized: false
}
```

### Server won't start
→ Check `.env` file exists in `vite-react-main/` folder
→ Verify all required variables are set

---

## Current Configuration

| Variable | Value |
|----------|-------|
| GMAIL_USER | bayou.biz.25@gmail.com |
| GMAIL_APP_PASSWORD | (needs regeneration) |
| GOOGLE_SHEET_ID | 1RLsUZjqEcMdbpdV-wUn5u7NWXazSSCaZfYkOdfkEZJA |
| GOOGLE_SERVICE_ACCOUNT_KEY | ./service-account-key.json |

---

## Next Steps After Setup

1. ✅ Test end-to-end flow (form → API → email + sheet)
2. Deploy backend to Render.com (free tier)
3. Update frontend API URL in production
4. Monitor Google Sheet for new leads