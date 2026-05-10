import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { google } from 'googleapis';

function generateROIPDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(24).font('Helvetica-Bold').text('Bayou Bros', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('ROI Calculation Report', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Your Information', { underline: true });
    doc.fontSize(12).font('Helvetica').text(`Email: ${data.email}`);
    doc.text(`Task: ${data.taskName}`);
    doc.text(`Industry: ${data.industry}`);
    doc.text(`Employees: ${data.employees}`);
    doc.text(`Hours per Week: ${data.hoursPerWeek}`);
    doc.text(`Hourly Rate: $${parseFloat(data.hourlyRate).toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Your Financial Loss', { underline: true });
    doc.fontSize(12).font('Helvetica');
    doc.text(`Weekly Loss: $${data.weeklyLoss.toFixed(2)}`);
    doc.text(`Monthly Loss: $${data.monthlyLoss.toFixed(2)}`);
    doc.text(`Yearly Loss: $${data.yearlyLoss.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Next Steps', { underline: true });
    doc.fontSize(12).font('Helvetica');
    doc.text('1. Review this report to understand your operational costs');
    doc.text('2. Reach out to our team to discuss AI automation solutions');
    doc.text('3. Get a custom implementation plan tailored to your business');
    doc.moveDown();

    doc.fontSize(10).text('Bayou Bros | bayoubiz.systeme.io', { align: 'center' });
    doc.end();
  });
}

async function sendEmailWithPDF(email, data, pdfBuffer) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

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
      <p><a href="https://bayoubiz.systeme.io/c8ac11b7" style="background-color:#40E0D0;color:#1a2332;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">Schedule Your Strategy Call</a></p>
      <p>Best,<br/>Bayou Bros Team</p>
    `,
    attachments: [
      { filename: 'ROI_Report.pdf', content: pdfBuffer, contentType: 'application/pdf' },
    ],
  });
}

async function saveToGoogleSheets(data) {
  const sheets = google.sheets('v4');
  let auth;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } else {
    auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  const authClient = await auth.getClient();
  await sheets.spreadsheets.values.append({
    auth: authClient,
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A:H',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        new Date().toISOString(),
        data.email,
        data.taskName,
        data.industry,
        data.employees,
        data.hoursPerWeek,
        data.hourlyRate,
        data.yearlyLoss,
      ]],
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, taskName, industry, employees, hoursPerWeek, hourlyRate } = req.body;

  if (!email || !taskName || !industry || !employees || !hoursPerWeek || !hourlyRate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hours = parseFloat(hoursPerWeek);
  const numEmployees = parseFloat(employees);
  const rate = parseFloat(hourlyRate);

  const weeklyLoss = hours * numEmployees * rate;
  const monthlyLoss = weeklyLoss * 4.33;
  const yearlyLoss = monthlyLoss * 12;

  const data = { email, taskName, industry, employees, hoursPerWeek, hourlyRate, weeklyLoss, monthlyLoss, yearlyLoss };

  try {
    await saveToGoogleSheets(data);
  } catch (err) {
    console.warn('Google Sheets skipped:', err.message);
  }

  let pdfBuffer;
  try {
    pdfBuffer = await generateROIPDF(data);
  } catch (err) {
    console.error('PDF generation failed:', err.message);
    return res.status(500).json({ error: 'PDF generation failed' });
  }

  try {
    await sendEmailWithPDF(email, data, pdfBuffer);
  } catch (err) {
    console.warn('Email skipped:', err.message);
  }

  return res.json({
    success: true,
    data: {
      weeklyLoss,
      monthlyLoss,
      yearlyLoss,
      hoursPerYear: hours * numEmployees * 52,
    },
  });
}
