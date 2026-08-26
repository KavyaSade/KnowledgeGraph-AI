const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  // SMTP credentials 
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else {
    // Generate temporary test credentials
    console.log('Generating Ethereal SMTP test account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const mailOptions = {
    from: `"KnowledgeGraph AI" <${process.env.SMTP_FROM || 'no-reply@knowledgegraph.ai'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  
  // If test account is used, return the preview URL
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Preview URL: %s', previewUrl);
    return { previewUrl };
  }

  return { success: true };
};

module.exports = sendEmail;
