import PDFDocument from 'pdfkit';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, taskName, industry, employees, hoursPerWeek, hourlyRate, weeklyLoss, monthlyLoss, yearlyLoss } = req.body;

  try {
    const pdfBuffer = await generateROIPDF({
      email, taskName, industry, employees, hoursPerWeek, hourlyRate,
      weeklyLoss, monthlyLoss, yearlyLoss,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ROI_Report.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: error.message });
  }
}
