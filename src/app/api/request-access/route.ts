import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json();
    if (!email || !fullName) {
      return NextResponse.json({ error: 'Missing email or full name' }, { status: 400 });
    }

    // Configure your SMTP transport (replace with your SMTP credentials)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const timestamp = new Date().toISOString();
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@yourdomain.com',
      to: 'eric@ejhedman.com',
      subject: 'Report Access',
      text: `A new report access request was submitted.\n\nFull Name: ${fullName}\nEmail: ${email}\nTime: ${timestamp}`,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending request access email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 