import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabaseServer } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jack@brokerlink.mx';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { property_id, property_title, name, email, phone, message } = body;

    if (!name || !email || !property_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = supabaseAdmin || supabaseServer;

    // Get property contact details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, title, contact_name, contact_email, neighborhood, state')
      .eq('id', property_id)
      .single();

    if (propertyError || !property) {
      console.error('Property not found:', propertyError);
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const ownerEmail = property.contact_email;
    const ownerName = property.contact_name || 'there';
    const propertyRef = `MHF-${property_id.substring(0, 8).toUpperCase()}`;
    const propertyLocation = [property.neighborhood, property.state].filter(Boolean).join(', ');

    // Save lead to mhf_leads
    const { error: leadError } = await supabase
      .from('mhf_leads')
      .insert({
        property_id,
        property_title,
        buyer_name: name,
        buyer_email: email,
        buyer_phone: phone || null,
        buyer_message: message || null,
        status: 'new',
        source: 'mexicohomefinder',
      });

    if (leadError) {
      console.error('Error saving lead:', leadError);
    }

    // Send email to property owner
    if (ownerEmail) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">

                    <!-- Header -->
                    <tr>
                      <td style="background:#1B2B4B;padding:28px 32px;">
                        <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">Mexico Home Finder</p>
                        <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">New Enquiry / Nueva Consulta</p>
                      </td>
                    </tr>

                    <!-- Body EN -->
                    <tr>
                      <td style="padding:32px 32px 0;">
                        <p style="margin:0 0 16px;font-size:15px;color:#111;">Hi ${ownerName},</p>
                        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">
                          You have received a new enquiry for your property on Mexico Home Finder.
                        </p>
                      </td>
                    </tr>

                    <!-- Property box -->
                    <tr>
                      <td style="padding:0 32px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border:1px solid #e5e5e5;border-radius:8px;margin:16px 0;">
                          <tr>
                            <td style="padding:16px 20px;">
                              <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Property / Propiedad</p>
                              <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#111;">${property_title}</p>
                              ${propertyLocation ? `<p style="margin:0;font-size:13px;color:#666;">${propertyLocation}</p>` : ''}
                              <p style="margin:8px 0 0;font-size:11px;color:#bbb;">Ref: ${propertyRef}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Contact details -->
                    <tr>
                      <td style="padding:0 32px;">
                        <p style="margin:16px 0 12px;font-size:13px;font-weight:600;color:#111;text-transform:uppercase;letter-spacing:0.5px;">Contact Details / Datos de Contacto</p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
                          <tr>
                            <td style="padding:12px 16px;background:#fafafa;border-bottom:1px solid #e5e5e5;width:120px;">
                              <p style="margin:0;font-size:12px;color:#999;">Name / Nombre</p>
                            </td>
                            <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                              <p style="margin:0;font-size:14px;font-weight:600;color:#111;">${name}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:12px 16px;background:#fafafa;border-bottom:1px solid #e5e5e5;">
                              <p style="margin:0;font-size:12px;color:#999;">Email</p>
                            </td>
                            <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                              <a href="mailto:${email}" style="color:#C1714F;text-decoration:none;font-size:14px;">${email}</a>
                            </td>
                          </tr>
                          ${phone ? `
                          <tr>
                            <td style="padding:12px 16px;background:#fafafa;border-bottom:1px solid #e5e5e5;">
                              <p style="margin:0;font-size:12px;color:#999;">Phone / Teléfono</p>
                            </td>
                            <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                              <a href="tel:${phone}" style="color:#C1714F;text-decoration:none;font-size:14px;">${phone}</a>
                            </td>
                          </tr>
                          ` : ''}
                          ${message ? `
                          <tr>
                            <td style="padding:12px 16px;background:#fafafa;">
                              <p style="margin:0;font-size:12px;color:#999;">Message / Mensaje</p>
                            </td>
                            <td style="padding:12px 16px;">
                              <p style="margin:0;font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap;">${message}</p>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                      <td style="padding:24px 32px;">
                        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(property_title)}"
                           style="display:inline-block;padding:12px 24px;background:#C1714F;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
                          Reply to ${name} →
                        </a>
                      </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                      <td style="padding:0 32px;">
                        <hr style="border:none;border-top:1px solid #f0f0f0;margin:0;">
                      </td>
                    </tr>

                    <!-- Body ES -->
                    <tr>
                      <td style="padding:24px 32px 0;">
                        <p style="margin:0 0 16px;font-size:15px;color:#111;">Hola ${ownerName},</p>
                        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">
                          Has recibido una nueva consulta para tu propiedad en Mexico Home Finder. Los datos de contacto del interesado se encuentran arriba.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding:24px 32px;border-top:1px solid #f0f0f0;margin-top:24px;">
                        <p style="margin:0;font-size:12px;color:#999;">
                          Mexico Home Finder · <a href="https://mexicohomefinder.com" style="color:#999;">mexicohomefinder.com</a>
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;

      try {
        await resend.emails.send({
          from: 'Mexico Home Finder <hello@mexicohomefinder.com>',
          to: ownerEmail,
          cc: ADMIN_EMAIL,
          subject: `New enquiry: ${property_title} [${propertyRef}]`,
          html,
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
