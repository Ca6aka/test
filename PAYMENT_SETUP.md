# Настройка системы платежей VIP/Premium с NOWPayments

## Требуемые переменные окружения

### 1. NOWPayments API ключ
```
NOWPAYMENTS_API_KEY=your-nowpayments-api-key
```
Получить на https://nowpayments.io/app

### 2. Email настройки для уведомлений
```
GAME_EMAIL=noreply@yourgame.com
ADMIN_EMAIL=admin@yourgame.com
```

### 3. SendGrid для email (опционально)
```
SENDGRID_API_KEY=SG.ваш_sendgrid_ключ
```

## Как работает система с NOWPayments

1. **Пользователь нажимает "Купить VIP/Premium"**
2. **Вводит email для подтверждения**
3. **Система создает инвойс через NOWPayments API**
4. **Пользователь перенаправляется на NOWPayments**
5. **Платит банковской картой или любой из 300+ криптовалют**
6. **NOWPayments автоматически конвертирует в USDT TRC20**
7. **USDT поступают на ваш кошелек в NOWPayments**
8. **Webhook активирует статус в игре**
9. **Email уведомление отправляется пользователю**

## Настройка NOWPayments

1. **Регистрация**: https://nowpayments.io/
2. **Создание API ключа** в панели управления
3. **Настройка webhook** для автоматического подтверждения платежей:
   - Webhook URL: `https://ваш-домен.replit.app/api/payment-webhook`
   - Если используете Replit: `https://your-repl-name.your-username.replit.app/api/payment-webhook`
   - Events: выберите "invoice.paid" и "payment.finished"
4. **Выбор USDT TRC20** как основной валюты для получения

## Преимущества NOWPayments

- **300+ криптовалют** для оплаты
- **Банковские карты** поддерживаются
- **Низкие комиссии** (особенно USDT TRC20)
- **Автоматические конвертации** в вашу валюту
- **Webhook система** для мгновенного подтверждения
- **КYC не требуется** для большинства транзакций

## Цены
- VIP: $2.50/месяц  
- Premium: $10 навсегда

## Настройка через админ-панель
Суперадмин может настроить все параметры через игровую админ-панель:
- NOWPayments API ключ
- Email для уведомлений
- Тестирование подключения