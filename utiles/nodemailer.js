import nodemailer from 'nodemailer';
import Dotenv  from 'dotenv';
Dotenv.config()

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.nodemailer_mail ,
    pass: process.env.nodemailer_mailKey,
  },
  tls: {
    rejectUnauthorized: true
  }
});
export {transporter};
