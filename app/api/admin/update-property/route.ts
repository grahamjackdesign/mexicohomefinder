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
    .select('title, contact_email, contact_name, images')
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

  // ── Approved ─────────────────────────────────────────────
  if (approval_status === 'approved') {
    const firstName = property.contact_name?.split(' ')[0] || 'there'
    const propertyImage = property.images?.[0] || null

    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#f2ede8;font-family:Georgia,'Times New Roman',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede8;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

                  <!-- Logo header -->
                  <tr>
                    <td align="center" style="background:#ffffff;padding:28px 32px 20px;">
                      <img src="https://mexicohomefinder.com/MHF_logo_on_white.png" alt="Mexico Home Finder" width="200" style="display:block;height:auto;" />
                    </td>
                  </tr>

                  <!-- Property image -->
                  ${propertyImage ? `
                  <tr>
                    <td style="padding:0;">
                      <img src="${propertyImage}" alt="${property.title}" width="560" style="display:block;width:100%;height:240px;object-fit:cover;" />
                    </td>
                  </tr>
                  ` : ''}

                  <!-- Green approval banner -->
                  <tr>
                    <td align="center" style="background:#2d6a4f;padding:14px 32px;">
                      <p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">✓ &nbsp;Your listing is now live</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 40px 28px;">
                      <p style="margin:0 0 20px;font-size:22px;color:#1a1a1a;line-height:1.3;">Hi ${firstName},</p>
                      <p style="margin:0 0 16px;font-size:16px;color:#444;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Great news — your property has been approved and is now live on Mexico Home Finder. Buyers and renters searching in your area can find it today.</p>

                      <!-- Listing title -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid #b87333;margin:24px 0;">
                        <tr>
                          <td style="padding:12px 20px;">
                            <p style="margin:0 0 4px;font-size:11px;color:#b87333;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Listed property</p>
                            <p style="margin:0;font-size:17px;font-weight:600;color:#1a1a1a;">${property.title}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">If you'd like to update your listing details or add more photos, you can do so from your dashboard at any time.</p>

                      <!-- CTA -->
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="border-radius:8px;background:#1B2B4B;">
                            <a href="https://mexicohomefinder.com" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">View Mexico Home Finder</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px 28px;border-top:1px solid #f0ebe4;">
                      <p style="margin:0;font-size:12px;color:#aaa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Mexico Home Finder · <a href="https://mexicohomefinder.com" style="color:#aaa;text-decoration:none;">mexicohomefinder.com</a></p>
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

  // ── Resubmit / Rejected ───────────────────────────────────
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
      ? `<table cellpadding="0" cellspacing="0"><tr><td style="border-radius:8px;background:#1B2B4B;"><a href="https://mexicohomefinder.com/list-property/dashboard" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Go to my dashboard</a></td></tr></table>`
      : ''

    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#f2ede8;font-family:Georgia,'Times New Roman',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede8;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

                  <!-- Logo header -->
                  <tr>
                    <td align="center" style="background:#ffffff;padding:28px 32px 20px;">
                      <img src="https://mexicohomefinder.com/MHF_logo_on_white.png" alt="Mexico Home Finder" width="200" style="display:block;height:auto;" />
                    </td>
                  </tr>

                  <!-- Status banner -->
                  <tr>
                    <td align="center" style="background:${isResubmit ? '#b87333' : '#7a1e1e'};padding:14px 32px;">
                      <p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${isResubmit ? '↻ &nbsp;Action required' : '✕ &nbsp;Listing not approved'}</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 40px 28px;">
                      <p style="margin:0 0 20px;font-size:22px;color:#1a1a1a;line-height:1.3;">Hi ${firstName},</p>
                      <p style="margin:0 0 16px;font-size:16px;color:#444;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${actionText}</p>

                      <!-- Listing title -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid #b87333;margin:24px 0;">
                        <tr>
                          <td style="padding:12px 20px;">
                            <p style="margin:0 0 4px;font-size:11px;color:#b87333;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Your listing</p>
                            <p style="margin:0;font-size:17px;font-weight:600;color:#1a1a1a;">${property.title}</p>
                          </td>
                        </tr>
                      </table>

                      ${rejection_reason ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border:1px solid #f5d9b8;border-radius:8px;margin:0 0 24px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0 0 6px;font-size:11px;color:#c97b3a;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Reason</p>
                            <p style="margin:0;font-size:14px;color:#444;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${rejection_reason}</p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}

                      <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${ctaText}</p>

                      ${ctaButton}
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px 28px;border-top:1px solid #f0ebe4;">
                      <p style="margin:0;font-size:12px;color:#aaa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Mexico Home Finder · <a href="https://mexicohomefinder.com" style="color:#aaa;text-decoration:none;">mexicohomefinder.com</a></p>
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
