# Настройка Email уведомлений для VIP/Premium платежей

## SendGrid Setup

### 1. Создание аккаунта SendGrid
1. Зарегистрируйтесь на https://sendgrid.com/
2. Подтвердите email адрес
3. Пройдите верификацию аккаунта

### 2. Получение API ключа
1. Перейдите в Settings → API Keys
2. Создайте новый API Key
3. Выберите "Full Access" или "Restricted Access" с правами Mail Send
4. Сохраните ключ (он показывается только один раз)

### 3. Настройка в проекте
Добавьте в переменные окружения:
```
SENDGRID_API_KEY=SG.ваш-api-ключ-здесь
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### 4. Верификация отправителя
1. В SendGrid перейдите в Settings → Sender Authentication
2. Верифицируйте email домен или single sender
3. Используйте верифицированный email в SENDGRID_FROM_EMAIL

## Шаблон письма

Система будет отправлять письма с подтверждением платежа содержащие:
- Статус заказа (VIP/Premium)
- Номер заказа
- Сумму платежа
- Дату активации
- Ссылку для возврата в игру

## Использование

После настройки переменных окружения, система автоматически будет отправлять email уведомления при успешных платежах через webhook `/api/payment-webhook`.

## Тестирование

Для тестирования email системы можно использовать эндпоинт:
```bash
POST /api/test-email
{
  "email": "test@example.com",
  "orderId": "test_123",
  "type": "vip",
  "amount": 2.5
}
```