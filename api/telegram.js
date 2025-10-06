// /api/telegram.js  —  Webhook Telegram pour Vercel (site statique)
module.exports = async (req, res) => {
  // Répond "OK" aux requêtes GET (health-check)
  if (req.method !== 'POST') return res.status(200).send('OK');

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const WEBAPP_URL = process.env.WEBAPP_URL || 'https://jbs-bot-shop.vercel.app';

    const update = req.body || {};
    const msg = update.message || update.edited_message || {};
    const chatId = msg.chat && msg.chat.id;
    const text = (msg.text || '').trim();

    // Quand l’utilisateur envoie /menu → bouton qui ouvre ta mini-app
    if (text === '/menu') {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Bienvenue dans la boutique JBS 🌿\nClique ci-dessous pour ouvrir la mini-app.',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🛍️ Ouvrir la boutique', web_app: { url: WEBAPP_URL } }]
            ]
          }
        })
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ ok: false });
  }
};
