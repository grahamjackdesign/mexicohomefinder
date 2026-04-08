import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { title, neighborhood, state, contact_name, contact_email, contact_phone, price, currency } = await req.json()

  const { error } = await resend.emails.send({
    from: 'Mexico Home Finder <hello@mexicohomefinder.com>',
    to: 'jack@brokerlink.mx',
    subject: `New property submission: ${title}`,
    html: `
      <h2>New MHF Property Submission</h2>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
        <tr><td style="color:#666">Property</td><td><strong>${title}</strong></td></tr>
        <tr><td style="color:#666">Location</td><td>${neighborhood ? neighborhood + ', ' : ''}${state}</td></tr>
        <tr><td style="color:#666">Price</td><td>${currency} ${Number(price).toLocaleString()}</td></tr>
        <tr><td style="color:#666">Contact</td><td>${contact_name}</td></tr>
        <tr><td style="color:#666">Email</td><td>${contact_email}</td></tr>
        <tr><td style="color:#666">Phone</td><td>${contact_phone}</td></tr>
      </table>
      <br/>
      <a href="https://mexicohomefinder.com/admin/properties" style="background:#2563eb;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:8px">
        Review in Admin Dashboard
      </a>
    `,
  })

  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ success: true })
}