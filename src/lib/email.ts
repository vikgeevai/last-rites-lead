import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const BUSINESS_EMAIL = "admin@indianlifememorial.com";
const FROM_EMAIL = "Indian Life Memorial <admin@indianlifememorial.com>";
const LOGO_URL = "https://indian-life-memorial.vercel.app/assets/indian-life-memorial-logo.png";

// ── Customer auto-reply ────────────────────────────────────────────────────
export async function sendCustomerEmail(data: {
  name: string;
  email: string;
  arrangementType: string;
  planningType: string;
  dispositionType: string;
  wakeDuration: string;
  location: string;
  coffinChoice: string;
  estimatedCost: string;
  coffinImageUrl?: string;
}) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header: white background so color logo renders perfectly -->
        <tr>
          <td style="background:#ffffff;padding:16px 16px 0;text-align:center;border-bottom:4px solid #2563eb;">
            <img src="${LOGO_URL}" alt="Indian Life Memorial" style="height:48px;width:auto;display:block;margin:0 auto 16px;" />
          </td>
        </tr>

        <!-- Blue title band -->
        <tr>
          <td style="background:#2563eb;padding:12px 16px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.02em;">Your Funeral Plan Estimate</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:20px 16px 0;">
            <h2 style="margin:0 0 8px;font-size:19px;color:#1e293b;">Dear ${data.name},</h2>
            <p style="margin:0;font-size:14px;color:#475569;line-height:1.7;">
              Thank you for reaching out to Indian Life Memorial. We have received your funeral plan request and one of our compassionate consultants will contact you shortly.
            </p>
          </td>
        </tr>

        <!-- Estimate box -->
        <tr>
          <td style="padding:16px 16px;">
            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px;text-align:center;">
              <p style="margin:0 0 4px;font-size:11px;color:#3b82f6;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Your Estimated Cost</p>
              <p style="margin:0;font-size:32px;font-weight:800;color:#1d4ed8;">${data.estimatedCost}</p>
              <p style="margin:6px 0 0;font-size:12px;color:#64748b;font-style:italic;">Estimate only — final cost may vary based on arrangements</p>
            </div>
          </td>
        </tr>

        <!-- Summary table -->
        <tr>
          <td style="padding:0 16px 16px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Your Selections</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
              ${[
                ["Arrangement", data.arrangementType],
                ["Planning Type", data.planningType],
                ["Disposition", data.dispositionType],
                ["Duration", data.wakeDuration],
                ["Location", data.location],
                ["Casket", data.coffinChoice],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? "#f8fafc" : "#ffffff"};">
                <td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600;width:40%;border-right:1px solid #e2e8f0;">${label}</td>
                <td style="padding:10px 14px;font-size:13px;color:#1e293b;">${value}</td>
              </tr>`).join("")}
            </table>
          </td>
        </tr>

        ${data.coffinImageUrl ? `
        <!-- Casket preview -->
        <tr>
          <td style="padding:0 16px 16px;text-align:center;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Selected Casket</p>
            <div style="background:#f8fafc;border-radius:10px;padding:16px;border:1px solid #e2e8f0;">
              <img src="${data.coffinImageUrl}" alt="Selected Casket" style="max-width:280px;width:100%;border-radius:8px;" />
            </div>
          </td>
        </tr>` : ""}

        <!-- Next steps -->
        <tr>
          <td style="padding:0 16px 16px;">
            <div style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 8px 8px 0;padding:16px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#15803d;">What happens next?</p>
              <p style="margin:0;font-size:13px;color:#166534;line-height:1.6;">
                Our consultant will reach out within <strong>5 minutes</strong>. Need help right now? Tap the button below.
              </p>
            </div>
          </td>
        </tr>

        <!-- WhatsApp CTA -->
        <tr>
          <td style="padding:0 16px 24px;text-align:center;">
            <a href="https://wa.me/6596875688?text=${encodeURIComponent("Hi, I just submitted a funeral plan request and would like assistance.")}"
               style="display:inline-block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:50px;letter-spacing:0.02em;">
              💬 WhatsApp Us Now
            </a>
            <p style="margin:8px 0 0;font-size:11px;color:#94a3b8;">+65 9687 5688 · Available 24/7</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:14px 16px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 3px;font-size:12px;color:#94a3b8;font-weight:600;">Indian Life Memorial Singapore</p>
            <p style="margin:0;font-size:11px;color:#cbd5e1;">&copy; ${new Date().getFullYear()} Indian Life Memorial. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  const text = `Dear ${data.name},

Thank you for reaching out to Indian Life Memorial. We have received your funeral plan request and one of our consultants will contact you shortly.

Your Estimated Cost: ${data.estimatedCost}

Your Selections:
- Arrangement: ${data.arrangementType}
- Planning Type: ${data.planningType}
- Disposition: ${data.dispositionType}
- Duration: ${data.wakeDuration}
- Location: ${data.location}
- Casket: ${data.coffinChoice}

Our consultant will reach out within 5 minutes. Need help right now? WhatsApp us at +65 9687 5688.

Indian Life Memorial Singapore
admin@indianlifememorial.com`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    replyTo: BUSINESS_EMAIL,
    subject: `Your Funeral Plan Estimate — Indian Life Memorial`,
    html,
    text,
    headers: {
      "X-Entity-Ref-ID": `ilm-customer-${Date.now()}`,
    },
  });
}

// ── Business owner lead notification ──────────────────────────────────────
export async function sendBusinessLeadEmail(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  arrangementType: string;
  planningType: string;
  dispositionType: string;
  wakeDuration: string;
  location: string;
  coffinChoice: string;
  highEndInterest: string;
  tentageSelected: string;
  floralPhotoFrame: string;
  estimatedCost: string;
  deceasedName?: string;
  deathCertNo?: string;
  coffinImageUrl?: string;
}) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;">

        <!-- Header: white background so color logo renders crisp -->
        <tr>
          <td style="background:#ffffff;padding:16px 16px;text-align:center;border-bottom:none;">
            <img src="${LOGO_URL}" alt="Indian Life Memorial" style="height:44px;width:auto;display:block;margin:0 auto;" />
          </td>
        </tr>

        <!-- Green confirmation bar -->
        <tr>
          <td style="background:#15803d;padding:10px 16px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;letter-spacing:0.02em;">✅ New Lead Received — Action Required</p>
          </td>
        </tr>

        <!-- Estimated value highlight -->
        <tr>
          <td style="padding:14px 16px 0;">
            <div style="background:rgba(37,99,235,0.15);border:1px solid rgba(37,99,235,0.4);border-radius:10px;padding:14px;text-align:center;">
              <p style="margin:0 0 2px;font-size:11px;color:#93c5fd;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Estimated Value</p>
              <p style="margin:0;font-size:28px;font-weight:800;color:#60a5fa;">${data.estimatedCost}</p>
            </div>
          </td>
        </tr>

        <!-- Contact info -->
        <tr>
          <td style="padding:12px 16px 0;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Contact Information</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #334155;">
              ${[
                ["Name", data.name],
                ["Phone", `<a href="tel:${data.phone}" style="color:#60a5fa;text-decoration:none;">${data.phone}</a>`],
                ["Email", `<a href="mailto:${data.email}" style="color:#60a5fa;text-decoration:none;">${data.email}</a>`],
                ["Address", data.address],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent"};">
                <td style="padding:10px 14px;font-size:12px;color:#94a3b8;font-weight:600;width:35%;border-right:1px solid #334155;">${label}</td>
                <td style="padding:10px 14px;font-size:13px;color:#e2e8f0;">${value}</td>
              </tr>`).join("")}
            </table>
          </td>
        </tr>

        <!-- Planning details -->
        <tr>
          <td style="padding:12px 16px 0;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Planning Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #334155;">
              ${[
                ["Planning Type", data.planningType],
                ["Arrangement", data.arrangementType],
                ["Disposition", data.dispositionType],
                ["Duration", data.wakeDuration],
                ["Location", data.location],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent"};">
                <td style="padding:10px 14px;font-size:12px;color:#94a3b8;font-weight:600;width:35%;border-right:1px solid #334155;">${label}</td>
                <td style="padding:10px 14px;font-size:13px;color:#e2e8f0;">${value}</td>
              </tr>`).join("")}
            </table>
          </td>
        </tr>

        <!-- Selections -->
        <tr>
          <td style="padding:12px 16px 0;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Selections</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #334155;">
              ${[
                ["Casket", data.coffinChoice],
                ["High-End Interest", data.highEndInterest],
                ["Tentage", data.tentageSelected],
                ["Floral Photo Frame", data.floralPhotoFrame],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent"};">
                <td style="padding:10px 14px;font-size:12px;color:#94a3b8;font-weight:600;width:35%;border-right:1px solid #334155;">${label}</td>
                <td style="padding:10px 14px;font-size:13px;color:#e2e8f0;">${value}</td>
              </tr>`).join("")}
            </table>
          </td>
        </tr>

        ${data.coffinImageUrl ? `
        <!-- Casket image -->
        <tr>
          <td style="padding:12px 16px 0;text-align:center;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Selected Casket</p>
            <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:16px;border:1px solid #334155;">
              <img src="${data.coffinImageUrl}" alt="Selected Casket" style="max-width:240px;width:100%;border-radius:8px;" />
            </div>
          </td>
        </tr>` : ""}

        ${data.deceasedName ? `
        <!-- Deceased info -->
        <tr>
          <td style="padding:12px 16px 0;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Deceased Information</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #334155;">
              <tr style="background:rgba(255,255,255,0.03);">
                <td style="padding:10px 14px;font-size:12px;color:#94a3b8;font-weight:600;width:35%;border-right:1px solid #334155;">Name</td>
                <td style="padding:10px 14px;font-size:13px;color:#e2e8f0;">${data.deceasedName}</td>
              </tr>
              ${data.deathCertNo ? `<tr>
                <td style="padding:10px 14px;font-size:12px;color:#94a3b8;font-weight:600;border-right:1px solid #334155;">Death Cert No.</td>
                <td style="padding:10px 14px;font-size:13px;color:#e2e8f0;">${data.deathCertNo}</td>
              </tr>` : ""}
            </table>
          </td>
        </tr>` : ""}

        <!-- Spacer -->
        <tr><td style="padding:20px;"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0f172a;padding:12px 16px;text-align:center;border-top:1px solid #334155;">
            <p style="margin:0;font-size:11px;color:#475569;">&copy; ${new Date().getFullYear()} Indian Life Memorial Singapore · Last Rites Lead CRM</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  const text = `NEW LEAD RECEIVED — ACTION REQUIRED

Estimated Value: ${data.estimatedCost}

Contact:
  Name: ${data.name}
  Email: ${data.email}
  Phone: ${data.phone}
  Address: ${data.address}

Planning:
  Arrangement: ${data.arrangementType}
  Planning Type: ${data.planningType}
  Disposition: ${data.dispositionType}
  Duration: ${data.wakeDuration}
  Location: ${data.location}

Selections:
  Casket: ${data.coffinChoice}
  High-End Interest: ${data.highEndInterest}
  Tentage: ${data.tentageSelected}
  Floral Photo Frame: ${data.floralPhotoFrame}

${data.deceasedName ? `Deceased: ${data.deceasedName}${data.deathCertNo ? ` (Cert: ${data.deathCertNo})` : ""}` : ""}

-- Last Rites Lead CRM · Indian Life Memorial Singapore`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: BUSINESS_EMAIL,
    subject: `New Lead: ${data.name} — ${data.arrangementType} (${data.estimatedCost})`,
    html,
    text,
    headers: {
      "X-Entity-Ref-ID": `ilm-lead-${Date.now()}`,
    },
  });
}
