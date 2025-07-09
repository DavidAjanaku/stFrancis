import express from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

// Configure email transporter
const createTransporter = async () => {
  const accessToken = await oAuth2Client.getAccessToken();
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token
    }
  });
};

// Submit prayer request
router.post('/', async (req, res) => {
  try {
    const { name, email, prayerRequest } = req.body;
    
    if (!prayerRequest) {
      return res.status(400).json({ 
        message: 'Prayer request content is required' 
      });
    }

    // Create email content
    const requesterInfo = name ? 
      `${name}${email ? ` (${email})` : ''}` : 
      (email ? `Anonymous (${email})` : 'Anonymous');

    const mailOptions = {
      from: `Church Website <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Prayer Request Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6cf7; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
            New Prayer Request
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #1f2937; margin-top: 0;">From:</h3>
            <p style="font-size: 16px; color: #4b5563;">${requesterInfo}</p>
            
            <h3 style="color: #1f2937; margin-top: 20px;">Prayer Request:</h3>
            <p style="font-size: 16px; color: #4b5563; white-space: pre-wrap;">${prayerRequest}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
            This request was submitted through the church website at ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    // Create transporter and send email
    const transporter = await createTransporter();
    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      message: 'Prayer request submitted successfully' 
    });
  } catch (error) {
    console.error('Prayer request error:', error);
    res.status(500).json({ 
      message: 'Failed to submit prayer request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;