import { sendContactMail } from "../services/mailService.js";

export const contactController = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ error: "Felder unvollständig." });

  try {
    await sendContactMail({ name, email, message });
    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false });
  }
};
