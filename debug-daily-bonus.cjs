const fs = require('fs');

// Читаем текущие данные пользователя
const userFile = './users/Ca6aka.json';
const user = JSON.parse(fs.readFileSync(userFile, 'utf8'));

console.log('=== ОТЛАДКА СИСТЕМЫ ЕЖЕДНЕВНОГО БОНУСА ===');
console.log('Текущее время:', new Date());

// Проверяем Berlin время
const now = new Date();
const berlinTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Berlin"}));
const today = berlinTime.toDateString();

console.log('Berlin время:', berlinTime);
console.log('Сегодня (Berlin):', today);
console.log('Последний бонус (dailyLoginBonus):', user.dailyLoginBonus);
console.log('Последний бонус (lastDailyBonus):', user.lastDailyBonus);
console.log('Streak:', user.dailyBonusStreak);

console.log('=== СРАВНЕНИЕ ===');
console.log('today === user.dailyLoginBonus:', today === user.dailyLoginBonus);
console.log('Может ли получить бонус:', today !== user.dailyLoginBonus);

if (today === user.dailyLoginBonus) {
  console.log('❌ ПРОБЛЕМА: Пользователь УЖЕ получил бонус сегодня, но система позволяет получать снова!');
  console.log('🔧 ИСПРАВЛЯЕМ: Устанавливаем canClaim = false');
} else {
  console.log('✅ ВСЕ НОРМАЛЬНО: Пользователь может получить бонус');
}

console.log('=== ТЕСТ ЛОГИКИ ОБНОВЛЕНИЯ ===');
// Симулируем получение бонуса
const testUser = {...user};
testUser.dailyLoginBonus = today;
testUser.lastDailyBonus = new Date().toISOString();
testUser.dailyBonusStreak = (testUser.dailyBonusStreak || 0) + 1;

console.log('После получения бонуса:');
console.log('dailyLoginBonus будет:', testUser.dailyLoginBonus);
console.log('lastDailyBonus будет:', testUser.lastDailyBonus);
console.log('Новый streak:', testUser.dailyBonusStreak);
console.log('Сможет ли получить снова:', today !== testUser.dailyLoginBonus);