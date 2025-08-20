const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.log('SendGrid API key not found - email notifications disabled');
}

const gameEmail = process.env.GAME_EMAIL || 'noreply@yourgame.com';

async function sendEmail(to, subject, html, text) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Email sending skipped - no SendGrid API key');
    return false;
  }

  try {
    await sgMail.send({
      to,
      from: gameEmail,
      subject,
      html,
      text
    });
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Email templates
const emailTemplates = {
  vipPurchase: (nickname, orderId) => ({
    subject: 'VIP статус - подтверждение покупки',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; margin: 0;">🌟 VIP статус активирован!</h1>
        </div>
        
        <div style="background: #2a2a2a; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #3b82f6; margin-top: 0;">Добро пожаловать в VIP клуб, ${nickname}!</h2>
          <p>Ваша покупка VIP статуса успешно обработана.</p>
          <p><strong>Номер заказа:</strong> ${orderId}</p>
          <p><strong>Стоимость:</strong> $2.50/месяц</p>
        </div>

        <div style="background: #1e3a8a; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #60a5fa; margin-top: 0;">🎁 Ваши VIP привилегии:</h3>
          <ul style="color: #cbd5e1; line-height: 1.6;">
            <li>🔥 <strong>1.5x опыт</strong> за все работы</li>
            <li>⚡ <strong>Ускоренные кулдауны:</strong> 2м/4м/6м вместо 3м/5м/7м</li>
            <li>💰 <strong>2x ежедневный бонус:</strong> +$200 вместо +$100</li>
            <li>🎯 <strong>25 слотов</strong> для серверов</li>
            <li>💎 <strong>VIP значок</strong> в чате</li>
            <li>🔧 <strong>Приоритет</strong> в технической поддержке</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #64748b;">Спасибо за поддержку проекта!</p>
          <p style="color: #64748b; font-size: 14px;">Команда Server Simulation Game</p>
        </div>
      </div>
    `,
    text: `VIP статус активирован! Добро пожаловать в VIP клуб, ${nickname}! Заказ: ${orderId}`
  }),

  premiumPurchase: (nickname, orderId) => ({
    subject: 'PREMIUM статус - подтверждение покупки',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #a855f7; margin: 0;">👑 PREMIUM статус активирован!</h1>
        </div>
        
        <div style="background: #2a2a2a; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #a855f7; margin-top: 0;">Поздравляем с PREMIUM статусом, ${nickname}!</h2>
          <p>Ваша покупка PREMIUM статуса успешно обработана.</p>
          <p><strong>Номер заказа:</strong> ${orderId}</p>
          <p><strong>Стоимость:</strong> $10.00 (навсегда!)</p>
        </div>

        <div style="background: #7c2d92; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #c084fc; margin-top: 0;">🚀 Ваши PREMIUM привилегии:</h3>
          <ul style="color: #cbd5e1; line-height: 1.6;">
            <li>🎯 <strong>1.75x опыт</strong> за все работы</li>
            <li>⚡ <strong>Супер кулдауны:</strong> 1.5м/2м/5м вместо 3м/5м/7м</li>
            <li>💎 <strong>5x ежедневный бонус:</strong> +$500 вместо +$100</li>
            <li>🏗️ <strong>30 слотов</strong> для серверов</li>
            <li>🔥 <strong>Мгновенное строительство</strong> серверов</li>
            <li>🎮 <strong>Без кулдаунов</strong> мини-игр</li>
            <li>👑 <strong>PREMIUM значок</strong> в чате</li>
            <li>🎭 <strong>Секретные админ реакции</strong></li>
            <li>🔧 <strong>Высший приоритет</strong> в поддержке</li>
          </ul>
        </div>

        <div style="background: #f59e0b; color: #000; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; font-weight: bold;">💡 PREMIUM статус действует навсегда - никаких ежемесячных платежей!</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #64748b;">Спасибо за вашу щедрую поддержку!</p>
          <p style="color: #64748b; font-size: 14px;">Команда Server Simulation Game</p>
        </div>
      </div>
    `,
    text: `PREMIUM статус активирован навсегда! Поздравляем, ${nickname}! Заказ: ${orderId}`
  }),

  paymentConfirmation: (nickname, type, orderId, amount) => ({
    subject: `${type === 'vip' ? 'VIP' : 'PREMIUM'} - платеж получен`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #22c55e; margin: 0;">✅ Платеж успешно обработан!</h1>
        </div>
        
        <div style="background: #2a2a2a; padding: 20px; border-radius: 6px;">
          <p>Здравствуйте, <strong>${nickname}</strong>!</p>
          <p>Ваш платеж за <strong>${type === 'vip' ? 'VIP' : 'PREMIUM'}</strong> статус успешно получен и обработан.</p>
          
          <hr style="border: 1px solid #404040; margin: 20px 0;">
          
          <p><strong>Детали платежа:</strong></p>
          <ul>
            <li>Заказ: ${orderId}</li>
            <li>Сумма: $${amount}</li>
            <li>Статус: ${type === 'vip' ? 'VIP (месячная подписка)' : 'PREMIUM (навсегда)'}</li>
            <li>Дата: ${new Date().toLocaleString('ru-RU')}</li>
          </ul>
          
          <p style="color: #22c55e; font-weight: bold;">Ваш новый статус уже активирован в игре!</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #404040;">
          <p style="color: #64748b;">Спасибо за поддержку проекта!</p>
        </div>
      </div>
    `,
    text: `Платеж за ${type === 'vip' ? 'VIP' : 'PREMIUM'} статус успешно получен! Заказ: ${orderId}`
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};