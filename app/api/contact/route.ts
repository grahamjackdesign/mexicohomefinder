import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to admin
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a3a52; padding: 20px; text-align: center;">
          <h1 style="color: #D4745E; margin: 0;">📬 New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fb;">
          <h2 style="color: #1a3a52; margin-top: 0;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e6ed; color: #5a6478;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e6ed; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e6ed; color: #5a6478;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e6ed;">
                <a href="mailto:${email}" style="color: #D4745E;">${email}</a>
              </td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e6ed; color: #5a6478;">Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e6ed;">
                <a href="tel:${phone}" style="color: #D4745E;">${phone}</a>
              </td>
            </tr>
            ` : ''}
          </table>
          
          <h2 style="color: #1a3a52; margin-top: 30px;">Message</h2>
          <p style="background-color: white; padding: 15px; border-radius: 8px; white-space: pre-wrap; border-left: 4px solid #D4745E;">${message}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${email}?subject=Re: Your inquiry on MexicoHomeFinder" 
               style="display: inline-block; background-color: #D4745E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Reply to ${name} →
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #5a6478; font-size: 12px;">
          <p>This contact form was submitted from MexicoHomeFinder.com</p>
        </div>
      </div>
    `;

    // Send email
    await resend.emails.send({
      from: 'MexicoHomeFinder <contact@mexicohomefinder.com>',
      to: 'jack@brokerlink.mx',
      replyTo: email,
      subject: `🔔 New Contact: ${name}`,
      html: emailHtml,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
