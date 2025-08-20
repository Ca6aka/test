// Тестируем активацию VIP статуса
const fs = require('fs');

// Активируем VIP статус у testuser123
const testUserFile = './users/testuser123.json';
let testUser = JSON.parse(fs.readFileSync(testUserFile, 'utf8'));

console.log('Before VIP activation:');
console.log('VIP Until:', testUser.vipUntil);
console.log('Premium Until:', testUser.premiumUntil);

// Активируем VIP на месяц (30 дней)
const now = Date.now();
const oneMonth = 30 * 24 * 60 * 60 * 1000;
testUser.vipUntil = now + oneMonth;

fs.writeFileSync(testUserFile, JSON.stringify(testUser, null, 2));

console.log('After VIP activation:');
console.log('VIP Until:', testUser.vipUntil, '(', new Date(testUser.vipUntil).toLocaleString('ru-RU'), ')');
console.log('VIP Active:', Date.now() < testUser.vipUntil);

// Также обновим Ca6aka файл с правильным dailyLoginBonus
const ca6akaFile = './users/Ca6aka.json';
let ca6aka = JSON.parse(fs.readFileSync(ca6akaFile, 'utf8'));

const berlinTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Berlin"}));
const today = berlinTime.toDateString();
console.log('Current Berlin date:', today);
console.log('Ca6aka dailyLoginBonus before:', ca6aka.dailyLoginBonus);

ca6aka.dailyLoginBonus = today;
fs.writeFileSync(ca6akaFile, JSON.stringify(ca6aka, null, 2));

console.log('Ca6aka dailyLoginBonus after:', ca6aka.dailyLoginBonus);
console.log('Should NOT be able to claim bonus:', ca6aka.dailyLoginBonus === today);