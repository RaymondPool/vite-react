# ROI Calculator Backend Setup

## Overview

The backend now handles:
1. **Email sending** - Sends ROI reports via Gmail using Nodemailer
2. **Data storage** - Saves calculations to Google Sheets
3. **PDF generation** - Generates and emails PDF reports, plus allows downloads

## Prerequisites

- Node.js 16+ installed
- Gmail account (for sending emails)
- Google Cloud project with Sheets API enabled
- Google Sheets to store data

## Setup Steps

### Step 1: Install Dependencies

```bash
cd vite-react-main
npm install
```

### Step 2: Set Up Gmail

1. Enable 2-Factor Authentication on your Gmail account
2. Create an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Copy the generated 16-character password

### Step 3: Set Up Google Sheets API

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Enable **Google Sheets API**:
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create a Service Account:
   - Go to "Service Accounts" in the left menu
   - Click "Create Service Account"
   - Name it "ROI Calculator"
   - Click "Create and Continue"
   - Skip optional steps and click "Done"
5. Create Key:
   - Click on the service account you created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - This downloads a `.json` file - save it to your project root
6. Share your Google Sheet with the service account email:
   - Copy the email from the JSON file (looks like `xxx@xxx.iam.gserviceaccount.com`)
   - Open your Google Sheet
   - Click Share
   - Add the email with "Editor" permissions

### Step 4: Create Google Sheet

1. Create a new Google Sheet for storing ROI calculations
2. Add headers in the first row:
   ```
   Timestamp | Email | Task | Industry | Employees | Hours/Week | Hourly Rate | Yearly Loss
   ```
3. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   GOOGLE_SERVICE_ACCOUNT_KEY=./path-to-downloaded-service-account-key.json
   GOOGLE_SHEET_ID=your-spreadsheet-id
   PORT=5000
   NODE_ENV=development
   ```

### Step 6: Run the Server

**Development mode:**
```bash
npm run server:dev
```

**Production mode:**
```bash
npm run server
```

The server will run on `http://localhost:5000`

### Step 7: Update Frontend API Calls

The frontend is already configured to call `/api/calculate-roi` and `/api/generate-pdf` on `localhost:5000` in development.

For production deployment (Vercel frontend + backend elsewhere):
- Update the API calls in `src/App.tsx` to use your backend URL
- Or use Vercel API routes for the backend functions

## API Endpoints

### POST `/api/calculate-roi`
Calculates ROI, sends email with PDF, and saves to Google Sheets.

**Request body:**
```json
{
  "email": "user@example.com",
  "taskName": "Data Entry",
  "industry": "Accounting",
  "employees": "2",
  "hoursPerWeek": "10",
  "hourlyRate": "50"
}
```

**Response:**
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

### POST `/api/generate-pdf`
Generates PDF without sending email (for download button).

**Request body:** Same as `/api/calculate-roi` plus calculated values
**Response:** PDF binary data

## Troubleshooting

**Email not sending:**
- Verify Gmail App Password is correct (16 characters)
- Check that 2FA is enabled on Gmail
- Make sure you're using Gmail, not other email providers

**Google Sheets not updating:**
- Verify service account email has access to the sheet
- Check that `GOOGLE_SHEET_ID` is correct
- Make sure JSON key file path is correct

**PDF not generating:**
- Check server logs for errors
- Verify all required fields are provided

## Deployment

### Render (Free Hosting)

1. Push code to GitHub
2. Go to https://render.com
3. Create new "Web Service"
4. Connect to your GitHub repo
5. Set Build Command: `npm install`
6. Set Start Command: `node server.js`
7. Add environment variables from `.env`
8. Deploy

### Vercel (Frontend) + Render (Backend)

Frontend stays on Vercel, backend on Render. Update frontend API URLs to your Render backend URL.

## Next Steps

- Test the calculator end-to-end
- Customize the PDF template styling
- Set up analytics tracking
- Create admin dashboard to view Google Sheets data
