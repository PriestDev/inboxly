const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  throw new Error('Email transport is not configured. Set GMAIL_USER/GMAIL_PASSWORD or SMTP_HOST/SMTP_USER/SMTP_PASSWORD.');
};

const sendEmail = async ({ to, subject, text, html, from }) => {
  const transporter = createTransporter();

  const defaultFrom = from || process.env.EMAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER;
  if (!defaultFrom) {
    throw new Error('Email from address is not configured. Set EMAIL_FROM, GMAIL_USER, or SMTP_USER.');
  }

  const mailOptions = {
    from: defaultFrom,
    to,
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail
};
