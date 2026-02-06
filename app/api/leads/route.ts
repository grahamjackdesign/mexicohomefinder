import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jack@brokerlink.mx';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { property_id, property_title, name, email, phone, message } = body;

    if (!name || !email || !property_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use supabaseAdmin if available, otherwise fall back to supabaseServer
    const supabase = supabaseAdmin || supabaseServer;

    // Check if this is a public property (uploaded by owner) or broker property
    let isPublicProperty = false;
    let propertyOwnerEmail: string | null = null;
    let propertyOwnerName: string | null = null;
    let propertyReference = '';
    let brokerId: string | null = null;
    let brokerName: string | null = null;
    let brokerEmail: string | null = null;

    console.log('=== LEAD SUBMISSION DEBUG ===');
    console.log('Property ID:', property_id);

    // First, check if it's in public_properties table
    const { data: publicProperty } = await supabase
      .from('public_properties')
      .select('id, contact_email, contact_name')
      .eq('id', property_id)
      .single();

    console.log('Public property check:', publicProperty);

    if (publicProperty) {
      isPublicProperty = true;
      propertyOwnerEmail = publicProperty.contact_email;
      propertyOwnerName = publicProperty.contact_name;
      propertyReference = `PP-${property_id.substring(0, 8)}`;
      console.log('>>> This is a PUBLIC property');
    } else {
      console.log('>>> This is a BROKER property');
      // It's a broker property - look up the broker info
      const { data: brokerProperty, error: brokerError } = await supabase
        .from('properties')
        .select(`
          id,
          client_id,
          clients:client_id (
            id,
            business_name,
            email
          )
        `)
        .eq('id', property_id)
        .single();

      console.log('Broker lookup result:', {
        brokerProperty,
        brokerError,
        property_id
      });

      if (brokerProperty?.clients) {
        // Handle both array and object cases
        const clientData = Array.isArray(brokerProperty.clients) 
          ? brokerProperty.clients[0] 
          : brokerProperty.clients;
        
        console.log('Client data extracted:', clientData);
        
        if (clientData) {
          brokerId = brokerProperty.client_id;
          brokerName = clientData.business_name;
          brokerEmail = clientData.email;
          console.log('Broker info set:', { brokerId, brokerName, brokerEmail });
        }
      }
      
      propertyReference = `BP-${property_id.substring(0, 8)}`;
    }

    // Save lead to mhf_leads table using admin client
    const { data: lead, error: leadError } = await supabase
      .from('mhf_leads')
      .insert({
        property_id,
        property_title,
        buyer_name: name,
        buyer_email: email,
        buyer_phone: phone,
        buyer_message: message,
        status: isPublicProperty ? 'purchased' : 'new', // Public properties auto-fulfill
        source: 'mexicohomefinder',
        base_price_usd: isPublicProperty ? 0.00 : 50.00,
        current_price_usd: isPublicProperty ? 0.00 : 50.00,
        broker_id: brokerId,
        broker_name: brokerName,
        broker_email: brokerEmail,
      })
      .select()
      .single();

    if (leadError) {
      console.error('Error saving lead:', leadError);
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      );
    }

    // === PUBLIC PROPERTY (Free Lead) ===
    if (isPublicProperty && propertyOwnerEmail) {
      // Email to property owner
      const ownerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a3a52; padding: 20px; text-align: center;">
            <h1 style="color: #D4745E; margin: 0;">🏠 You Have a New Inquiry!</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fb;">
            <p style="color: #333; font-size: 16px; margin-top: 0;">
              Hi ${propertyOwnerName || 'there'},
            </p>
            
            <p style="color: #333; font-size: 16px;">
              Great news! Someone is interested in your property <strong>"${property_title}"</strong> on MexicoHomeFinder.
            </p>
            
            <div style="background-color: #e8f4f8; padding: 12px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1a3a52; font-size: 13px;">
                <strong>Reference:</strong> ${propertyReference}
              </p>
            </div>
            
            <h2 style="color: #1a3a52; margin-top: 20px;">Contact Information</h2>
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
            
            ${message ? `
            <h2 style="color: #1a3a52; margin-top: 30px;">Their Message</h2>
            <p style="background-color: white; padding: 15px; border-radius: 8px; white-space: pre-wrap; border-left: 4px solid #D4745E;">${message}</p>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(property_title)}" 
                 style="display: inline-block; background-color: #D4745E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Reply to ${name} →
              </a>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>💡 Tip:</strong> Respond quickly! Fast responses lead to more successful deals.
              </p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #5a6478; font-size: 12px;">
            <p>This inquiry was generated from MexicoHomeFinder.com</p>
          </div>
        </div>
      `;

      // Send to property owner
      try {
        console.log('Attempting to send email to property owner:', propertyOwnerEmail);
        const result = await resend.emails.send({
          from: 'MexicoHomeFinder <leads@mexicohomefinder.com>',
          to: propertyOwnerEmail,
          cc: ADMIN_EMAIL, // Copy you in
          subject: `🏠 New Inquiry: ${property_title} [${propertyReference}]`,
          html: ownerEmailHtml,
        });
        console.log('Email sent successfully:', result);
      } catch (emailError) {
        console.error('Property owner email error:', emailError);
      }

      return NextResponse.json({ 
        success: true,
        leadId: lead.id,
        type: 'public_property',
        message: 'Lead sent to property owner' 
      });
    }

    // === BROKER PROPERTY (Paid Lead - $50) ===
    const brokerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a3a52; padding: 20px; text-align: center;">
          <h1 style="color: #D4745E; margin: 0;">💰 New $50 Lead Available</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fb;">
          <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
            <p style="margin: 0; color: #155724; font-size: 16px;">
              <strong>💵 Lead Value:</strong> $50 USD<br>
              <strong>Reference:</strong> ${propertyReference}
            </p>
          </div>

          ${brokerName ? `
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196F3; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1565C0;">🏢 Property Listed By</h3>
            <p style="margin: 0; color: #0d47a1;">
              <strong>Broker:</strong> ${brokerName}<br>
              <strong>Email:</strong> <a href="mailto:${brokerEmail}" style="color: #2196F3;">${brokerEmail}</a>
            </p>
          </div>
          ` : ''}
          
          <h2 style="color: #1a3a52; margin-top: 0;">Buyer Information</h2>
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
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e6ed; color: #5a6478;">Lead ID:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e6ed; font-family: monospace; font-size: 12px;">${lead.id}</td>
            </tr>
          </table>
          
          <h2 style="color: #1a3a52; margin-top: 30px;">Property</h2>
          <p style="background-color: white; padding: 15px; border-radius: 8px; border-left: 4px solid #D4745E;">
            <strong>${property_title}</strong><br>
            <a href="https://mexicohomefinder.com/properties/${property_id}" style="color: #D4745E;">
              View Property →
            </a>
          </p>
          
          ${message ? `
          <h2 style="color: #1a3a52; margin-top: 30px;">Buyer's Message</h2>
          <p style="background-color: white; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
          ` : ''}
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 30px;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⏰ Next Step:</strong> Assign this lead to ${brokerName || 'a broker'} via the admin panel. Lead will cascade through tier system if not purchased.
            </p>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #5a6478; font-size: 12px;">
          <p>Lead captured via MexicoHomeFinder.com • Ref: ${propertyReference}</p>
        </div>
      </div>
    `;

    // Send to admin (you) for broker properties
    try {
      console.log('Attempting to send broker lead email to admin:', ADMIN_EMAIL);
      const result = await resend.emails.send({
        from: 'MexicoHomeFinder <leads@mexicohomefinder.com>',
        to: ADMIN_EMAIL,
        subject: `💰 New $50 Lead: ${property_title} [${propertyReference}]`,
        html: brokerEmailHtml,
      });
      console.log('Broker email sent successfully:', result);
    } catch (emailError) {
      console.error('Broker email error:', emailError);
    }

    // TODO Phase 2: Start broker cascade for paid leads

    return NextResponse.json({ 
      success: true,
      leadId: lead.id,
      type: 'broker_property',
      message: 'Lead saved - awaiting broker assignment' 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


