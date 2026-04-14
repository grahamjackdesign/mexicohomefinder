import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  const { id, approval_status, show_on_mhf, rejection_reason, status } = await req.json()

  const update: any = { approval_status, show_on_mhf }
  if (status !== undefined) update.status = status
  if (rejection_reason !== undefined) update.rejection_reason = rejection_reason

  // Fetch property before update so we have contact details
  const { data: property, error: fetchError } = await supabaseAdmin
    .from('properties')
    .select('title, contact_email, contact_name')
    .eq('id', id)
    .single()

  if (fetchError || !property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }

  const { error } = await supabaseAdmin
    .from('properties')
    .update(update)
    .eq('id', id)

  if (error) {
    console.error('Supabase update error:', JSON.stringify(error))
    return NextResponse.json({ error: error.message, details: error }, { status: 400 })
  }

  // Send email on approved
  if (approval_status === 'approved') {
    const firstName = property.contact_name?.split(' ')[0] || 'there'

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
                      <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">Mexico Home Finder</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:32px;">
                      <p style="margin:0 0 16px;font-size:16px;color:#111;">Hi ${firstName},</p>
                      <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">Great news — your property has been approved and is now live on Mexico Home Finder.</p>

                      <!-- Listing box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0faf4;border:1px solid #b6e4c7;border-radius:8px;margin:20px 0;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0 0 4px;font-size:11px;color:#4caf7d;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Now live</p>
                            <p style="margin:0;font-size:15px;font-weight:600;color:#111;">${property.title}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">Buyers and renters searching in your area can now find your listing.</p>

                      <a href="https://mexicohomefinder.com" style="display:inline-block;padding:12px 24px;background:#1B2B4B;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">View Mexico Home Finder</a>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 32px;border-top:1px solid #f0f0f0;">
                      <p style="margin:0;font-size:12px;color:#999;">Mexico Home Finder · <a href="https://mexicohomefinder.com" style="color:#999;">mexicohomefinder.com</a></p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    const { error: emailError } = await resend.emails.send({
      from: 'Mexico Home Finder <hello@mexicohomefinder.com>',
      to: property.contact_email,
      subject: `Your property is now live on Mexico Home Finder`,
      html,
    })

    if (emailError) {
      console.error('Resend error:', JSON.stringify(emailError))
    }
  }

  // Send email on resubmit or rejected
  if (approval_status === 'resubmit' || approval_status === 'rejected') {
    const isResubmit = approval_status === 'resubmit'
    const firstName = property.contact_name?.split(' ')[0] || 'there'

    const subject = isResubmit
      ? `Action required: your listing needs updating`
      : `Your Mexico Home Finder listing was not approved`

    const actionText = isResubmit
      ? `We've reviewed your listing and need a few changes before we can publish it.`
      : `Unfortunately your listing didn't meet our requirements and won't be published at this time.`

    const ctaText = isResubmit
      ? `Please log in to your dashboard to update your listing and resubmit.`
      : `If you have any questions, please reply to this email.`

    const ctaButton = isResubmit
      ? `<a href="https://mexicohomefinder.com/list-property/dashboard" style="display:inline-block;padding:12px 24px;background:#1B2B4B;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Go to my dashboard</a>`
      : ''

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
                      <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">Mexico Home Finder</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:32px;">
                      <p style="margin:0 0 16px;font-size:16px;color:#111;">Hi ${firstName},</p>
                      <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">${actionText}</p>

                      <!-- Listing box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border:1px solid #e5e5e5;border-radius:8px;margin:20px 0;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Your listing</p>
                            <p style="margin:0;font-size:15px;font-weight:600;color:#111;">${property.title}</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Reason box -->
                      ${rejection_reason ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border:1px solid #f5d9b8;border-radius:8px;margin:0 0 20px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0 0 6px;font-size:11px;color:#c97b3a;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Reason</p>
                            <p style="margin:0;font-size:14px;color:#444;">${rejection_reason}</p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}

                      <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">${ctaText}</p>

                      ${ctaButton}
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 32px;border-top:1px solid #f0f0f0;">
                      <p style="margin:0;font-size:12px;color:#999;">Mexico Home Finder · <a href="https://mexicohomefinder.com" style="color:#999;">mexicohomefinder.com</a></p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    const { error: emailError } = await resend.emails.send({
      from: 'Mexico Home Finder <hello@mexicohomefinder.com>',
      to: property.contact_email,
      subject,
      html,
    })

    if (emailError) {
      console.error('Resend error:', JSON.stringify(emailError))
      // Don't fail the whole request — DB update succeeded
    }
  }

  return NextResponse.json({ success: true })
}
