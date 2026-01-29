import nodemailer from 'nodemailer';
import { google } from 'googleapis';

import Dotenv  from 'dotenv';
Dotenv.config()

const Client_id = process.env.Client_id
const Client_secret = process.env.Client_secret
const REDIRECT_URL = process.env.Redirect_url
const Refresh_token = process.env.Refresh_token
const nodemailer_mail = process.env.nodemailer_mail

const oauth2Client = new google.auth.OAuth2(Client_id,Client_secret,REDIRECT_URL);

const refresh_token = oauth2Client.setCredentials({refresh_token:Refresh_token});

  const accessToken = await oauth2Client.getAccessToken().then(response => response.token );
// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true, // Use true for port 465, false for port 587
  auth: {
    type:"oauth2",
    clientId: Client_id,
    clientSecret:Client_secret,
  },
});
export {transporter,refresh_token,accessToken,nodemailer_mail};
