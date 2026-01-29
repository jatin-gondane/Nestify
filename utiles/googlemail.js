import { google } from 'googleapis';
import Dotenv from 'dotenv';
Dotenv.config();

const Client_id = process.env.Client_id;
const Client_secret = process.env.Client_secret;
const REDIRECT_URL = process.env.Redirect_url;
const Refresh_token = process.env.Refresh_token;
const nodemailer_mail = process.env.nodemailer_mail;

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  Client_id,
  Client_secret,
  REDIRECT_URL
);

// Set credentials
oauth2Client.setCredentials({ refresh_token: Refresh_token });

// Create Gmail API instance
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export { gmail, nodemailer_mail };