import { Resend } from "resend";

export default async function handler(req, res) {
  // (Opcional) CORS básico
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const emailToRaw = process.env.EMAIL_TO;

    if (!resendKey) return res.status(500).json({ ok: false, error: "Missing RESEND_API_KEY" });
    if (!fromEmail) return res.status(500).json({ ok: false, error: "Missing FROM_EMAIL" });
    if (!emailToRaw) return res.status(500).json({ ok: false, error: "Missing EMAIL_TO" });

    const resend = new Resend(resendKey);

    // Vercel parsea JSON y x-www-form-urlencoded.
    const body = req.body || {};
    const nombre = (body.nombre || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const mensaje = (body.mensaje || "").toString().trim();

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        ok: false,
        error: "Faltan campos: nombre, email, mensaje",
      });
    }

    const to = emailToRaw.split(",").map((e) => e.trim()).filter(Boolean);
    if (!to.length) return res.status(500).json({ ok: false, error: "EMAIL_TO vacío o inválido" });

    const { data, error } = await resend.emails.send({
      from: `Landing Valentina <${fromEmail}>`,
      to,
      replyTo: email, // ✅ importante: replyTo (no reply_to)
      subject: "Landing Valentina - Nuevo mensaje de contacto",
      text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`,
      html: `
        <h2>Nuevo mensaje desde el formulario</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(mensaje).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      return res.status(500).json({ ok: false, error: error.message || "Resend error" });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Unexpected error" });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
