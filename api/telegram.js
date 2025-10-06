export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(200).send('OK');

    const update = req.body;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN manquant !');
      return res.status(500).send('Token manquant');
    }

    const API = `https://api.telegram.org/bot${token}`;

    const sendMessage = async (chat_id, text, reply_markup) => {
      await fetch(`${API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text, parse_mode: 'HTML', reply_markup })
      });
    };

    const openButton = {
      inline_keyboard: [[
        { text: '🛍️ Ouvrir la mini app', web_app: { url: 'https://jbs-bot-shop.vercel.app' } }
      ]]
    };

    if (update.message) {
      const { chat, text } = update.message;
      if (!chat || !chat.id) return res.status(200).send('OK');

      if (text && text.trim().toLowerCase() === '/menu') {
        await sendMessage(
          chat.id,
          'Bienvenue dans la boutique <b>JBS</b> 🌿 — clique ci-dessous pour ouvrir la mini app 🛍️',
          openButton
        );
      } else if (text && text.startsWith('/start')) {
        await sendMessage(
          chat.id,
          'Salut ! Tape <b>/menu</b> pour ouvrir la boutique JBS 🌿',
          openButton
        );
      }
    }

    return res.status(200).send('OK');
  } catch (e) {
    console.error(e);
    return res.status(200).send('OK');
  }
}

