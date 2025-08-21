# Fiat Payment Integration Options

## Current Status
NOWPayments не поддерживает настоящие fiat платежи картой. Сервис работает только с криптовалютами.

## Проблемы с NOWPayments + Mercuryo
1. **NOWPayments не поддерживает USD как валюту оплаты** - только stablecoins (USDT, USDC)
2. **Mercuryo - отдельный сервис** который не интегрирован через NOWPayments API
3. **Все платежи через NOWPayments - только crypto**

## Варианты реализации fiat платежей

### Вариант 1: Stripe (Рекомендуется)
- ✅ Полная поддержка fiat платежей
- ✅ Visa/Mastercard/Apple Pay/Google Pay
- ✅ Международные платежи
- ⚠️ Требует отдельную интеграцию
- ⚠️ Комиссия ~2.9% + $0.30

**Интеграция:**
```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

### Вариант 2: PayPal
- ✅ Международные платежи
- ✅ Простая интеграция
- ⚠️ Высокие комиссии
- ⚠️ Региональные ограничения

### Вариант 3: Гибридный подход
- NOWPayments для crypto платежей ($2.50 VIP, $10 Premium)
- Stripe для fiat платежей (те же цены)
- Единый интерфейс выбора способа оплаты

## Текущее состояние
- ✅ NOWPayments crypto платежи работают
- ❌ Fiat платежи временно отключены
- 🔄 Ожидается выбор интеграции fiat провайдера

## Рекомендации
1. Добавить Stripe для fiat платежей
2. Сохранить NOWPayments для crypto
3. Создать единый UI для выбора метода оплаты