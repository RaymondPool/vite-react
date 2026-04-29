import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gmail transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  }
});

// Initialize Google Sheets API
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = 'Sheet1!A:G';

// Save calculation to Google Sheets
async function saveToGoogleSheets(data) {
  try {
    const authClient = await auth.getClient();
    
    const values = [
      [
        new Date().toISOString(),
        data.email,
        data.taskName,
        data.industry,
        data.employees,
        data.hoursPerWeek,
        data.hourlyRate,
        data.yearlyLoss,
      ],
    ];

    await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    console.log('Data saved to Google Sheets');
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
}

// Generate PDF
function generateROIPDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('Bayou Bros', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('ROI Calculation Report', { align: 'center' });
    doc.moveDown();

    // Separator
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();

    // Date
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Your Information
    doc.fontSize(14).font('Helvetica-Bold').text('Your Information', { underline: true });
    doc.fontSize(12).font('Helvetica').text(`Email: ${data.email}`);
    doc.text(`Task: ${data.taskName}`);
    doc.text(`Industry: ${data.industry}`);
    doc.text(`Employees: ${data.employees}`);
    doc.text(`Hours per Week: ${data.hoursPerWeek}`);
    doc.text(`Hourly Rate: $${parseFloat(data.hourlyRate).toFixed(2)}`);
    doc.moveDown();

    // Results
    doc.fontSize(14).font('Helvetica-Bold').text('Your Financial Loss', { underline: true });
    doc.fontSize(12).font('Helvetica');
    doc.text(`Weekly Loss: $${data.weeklyLoss.toFixed(2)}`, { color: '#d32f2f' });
    doc.text(`Monthly Loss: $${data.monthlyLoss.toFixed(2)}`, { color: '#d32f2f' });
    doc.text(`Yearly Loss: $${data.yearlyLoss.toFixed(2)}`, { color: '#d32f2f', fontSize: 16 });
    doc.moveDown();

    // Next Steps
    doc.fontSize(14).font('Helvetica-Bold').text('Next Steps', { underline: true });
    doc.fontSize(12)
      .font('Helvetica')
      .text('1. Review this report to understand your operational costs', { align: 'left' });
    doc.text('2. Reach out to our team to discuss AI automation solutions', { align: 'left' });
    doc.text('3. Get a custom implementation plan tailored to your business', { align: 'left' });
    doc.moveDown();

    // Footer
    doc.fontSize(10).text('Contact us: bayoubros@example.com | www.bayoubros.com', { align: 'center' });

    doc.end();
  });
}

// Send email with PDF attachment
async function sendEmailWithPDF(email, data, pdfBuffer) {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your AI Automation ROI Report',
      html: `
        <h2>Hey there! 👋</h2>
        <p>Thanks for calculating your ROI with Bayou Bros.</p>
        <p><strong>Here's what you're losing:</strong></p>
        <ul>
          <li>Weekly Loss: <strong>$${data.weeklyLoss.toFixed(2)}</strong></li>
          <li>Monthly Loss: <strong>$${data.monthlyLoss.toFixed(2)}</strong></li>
          <li>Yearly Loss: <strong>$${data.yearlyLoss.toFixed(2)}</strong></li>
        </ul>
        <p>Your complete report is attached. Ready to learn how AI can eliminate these costs?</p>
        <p><a href="https://bayoubiz.systeme.io/c8ac11b7" style="background-color: #40E0D0; color: #1a2332; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Schedule Your Strategy Call</a></p>
        <p>Best,<br/>Bayou Bros Team</p>
      `,
      attachments: [
        {
          filename: 'ROI_Report.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log('Email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// API endpoint to calculate and save ROI
app.post('/api/calculate-roi', async (req, res) => {
  try {
    const { email, taskName, industry, employees, hoursPerWeek, hourlyRate } = req.body;

    // Validate input
    if (!email || !taskName || !industry || !employees || !hoursPerWeek || !hourlyRate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate ROI
    const hours = parseFloat(hoursPerWeek);
    const numEmployees = parseFloat(employees);
    const rate = parseFloat(hourlyRate);

    const weeklyLoss = hours * numEmployees * rate;
    const monthlyLoss = weeklyLoss * 4.33;
    const yearlyLoss = monthlyLoss * 12;

    const data = {
      email,
      taskName,
      industry,
      employees,
      hoursPerWeek,
      hourlyRate,
      weeklyLoss,
      monthlyLoss,
      yearlyLoss,
    };

    // Save to Google Sheets (optional - won't fail if not configured)
    try {
      await saveToGoogleSheets(data);
    } catch (error) {
      console.warn('Warning: Could not save to Google Sheets:', error.message);
    }

    // Generate PDF
    const pdfBuffer = await generateROIPDF(data);

    // Send email with PDF (optional - won't fail if email service is down)
    try {
      await sendEmailWithPDF(email, data, pdfBuffer);
    } catch (error) {
      console.warn('Warning: Could not send email:', error.message);
    }

    res.json({
      success: true,
      data: {
        weeklyLoss,
        monthlyLoss,
        yearlyLoss,
        hoursPerYear: hours * numEmployees * 52,
      },
    });
  } catch (error) {
    console.error('Error in /api/calculate-roi:', error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get PDF for download
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { email, taskName, industry, employees, hoursPerWeek, hourlyRate, weeklyLoss, monthlyLoss, yearlyLoss } = req.body;

    const data = {
      email,
      taskName,
      industry,
      employees,
      hoursPerWeek,
      hourlyRate,
      weeklyLoss,
      monthlyLoss,
      yearlyLoss,
    };

    const pdfBuffer = await generateROIPDF(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ROI_Report.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
