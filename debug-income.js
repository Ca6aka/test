// Диагностика системы доходов
import storage from './server/storage.js';

async function diagnoseIncomeSystem() {
  try {
    console.log('=== ДИАГНОСТИКА СИСТЕМЫ ДОХОДОВ ===\n');
    
    // Получаем всех пользователей
    const allUsers = await storage.getAllUsers();
    console.log(`Всего пользователей: ${allUsers.length}\n`);
    
    // Получаем все серверы  
    const allServers = await storage.getServers();
    console.log(`Всего серверов: ${allServers.length}`);
    console.log(`Включенных серверов: ${allServers.filter(s => s.isOnline).length}`);
    console.log(`Выключенных серверов: ${allServers.filter(s => !s.isOnline).length}\n`);
    
    // Анализируем каждого пользователя
    for (const user of allUsers) {
      console.log(`--- Пользователь: ${user.nickname} ---`);
      console.log(`ID: ${user.id}`);
      console.log(`Баланс: $${user.balance || 0}`);
      console.log(`Уровень: ${user.level || 1}`);
      
      const lastUpdate = user.lastIncomeUpdate;
      if (lastUpdate) {
        const timeSinceUpdate = Date.now() - lastUpdate;
        const minutesSinceUpdate = Math.floor(timeSinceUpdate / 60000);
        console.log(`Последнее обновление дохода: ${new Date(lastUpdate).toLocaleString()}`);
        console.log(`Время с последнего обновления: ${minutesSinceUpdate} минут`);
      } else {
        console.log(`Последнее обновление дохода: НИКОГДА`);
      }
      
      // Получаем серверы пользователя
      const userServers = allServers.filter(s => s.ownerId === user.id);
      console.log(`Серверов: ${userServers.length}`);
      
      if (userServers.length > 0) {
        const onlineServers = userServers.filter(s => s.isOnline);
        const offlineServers = userServers.filter(s => !s.isOnline);
        
        console.log(`  - Включено: ${onlineServers.length}`);
        console.log(`  - Выключено: ${offlineServers.length}`);
        
        if (onlineServers.length > 0) {
          const totalIncomePerMinute = onlineServers.reduce((sum, server) => {
            const baseIncome = server.incomePerMinute;
            const loadPercentage = server.loadPercentage || 50;
            const loadAdjustment = baseIncome * (1 + (loadPercentage - 50) / 100);
            return sum + loadAdjustment;
          }, 0);
          
          const rentalCost = totalIncomePerMinute * 0.1;
          const netIncomePerMinute = totalIncomePerMinute - rentalCost;
          
          console.log(`  - Доход/мин: $${Math.floor(totalIncomePerMinute)}`);
          console.log(`  - Аренда/мин: $${Math.floor(rentalCost)}`);
          console.log(`  - Чистый доход/мин: $${Math.floor(netIncomePerMinute)}`);
          
          // Проверим потенциальный доход, если обновить сейчас
          if (lastUpdate) {
            const timeDiff = Date.now() - lastUpdate;
            const potentialIncome = Math.floor((netIncomePerMinute * timeDiff) / 60000);
            console.log(`  - ПОТЕНЦИАЛЬНЫЙ ДОХОД: $${potentialIncome}`);
          }
        }
        
        // Показываем проблемные серверы
        const problematicServers = userServers.filter(s => s.durability <= 10 || (s.isOnline && s.durability <= 50));
        if (problematicServers.length > 0) {
          console.log(`  ⚠️  ПРОБЛЕМНЫЕ СЕРВЕРЫ:`);
          problematicServers.forEach(s => {
            console.log(`    - ${s.name}: ${s.isOnline ? 'ВКЛ' : 'ВЫКЛ'}, прочность ${s.durability}%`);
          });
        }
      }
      
      console.log('');
    }
    
    // Ищем пользователей с потенциально застрявшими доходами
    console.log('=== ПОТЕНЦИАЛЬНЫЕ ПРОБЛЕМЫ ===');
    const now = Date.now();
    const problemUsers = [];
    
    for (const user of allUsers) {
      const userServers = allServers.filter(s => s.ownerId === user.id && s.isOnline);
      const lastUpdate = user.lastIncomeUpdate;
      
      if (userServers.length > 0 && lastUpdate) {
        const timeSinceUpdate = now - lastUpdate;
        const minutesSinceUpdate = Math.floor(timeSinceUpdate / 60000);
        
        // Если у пользователя есть активные серверы, но доходы не обновлялись больше 5 минут
        if (minutesSinceUpdate > 5) {
          problemUsers.push({
            user,
            minutesSinceUpdate,
            activeServers: userServers.length
          });
        }
      }
    }
    
    if (problemUsers.length > 0) {
      console.log('Пользователи с застрявшими доходами:');
      problemUsers.forEach(({ user, minutesSinceUpdate, activeServers }) => {
        console.log(`- ${user.nickname}: ${activeServers} активных серверов, не обновлялось ${minutesSinceUpdate} минут`);
      });
    } else {
      console.log('Проблем с доходами не обнаружено.');
    }
    
  } catch (error) {
    console.error('Ошибка диагностики:', error);
  }
}

// Функция для принудительного обновления доходов всех пользователей
async function forceUpdateAllIncomes() {
  try {
    console.log('\n=== ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ ДОХОДОВ ===');
    
    const allUsers = await storage.getAllUsers();
    const allServers = await storage.getServers();
    
    for (const user of allUsers) {
      const userServers = allServers.filter(s => s.ownerId === user.id && s.isOnline);
      
      if (userServers.length > 0) {
        console.log(`Обновляю доходы для ${user.nickname}...`);
        try {
          const result = await storage.updateIncome(user.id);
          if (result.netIncome !== 0) {
            console.log(`  ✓ Начислено: $${result.netIncome} (доход: $${result.incomeEarned}, аренда: $${result.rentalCost})`);
          } else {
            console.log(`  - Нет изменений в доходах`);
          }
        } catch (error) {
          console.log(`  ✗ Ошибка: ${error.message}`);
        }
      }
    }
    
    console.log('Обновление завершено.');
    
  } catch (error) {
    console.error('Ошибка при обновлении доходов:', error);
  }
}

// Запускаем диагностику
diagnoseIncomeSystem().then(() => {
  console.log('\n--- Хотите принудительно обновить доходы? (y/n) ---');
  
  // Для автоматического запуска в целях диагностики
  if (process.argv.includes('--force-update')) {
    return forceUpdateAllIncomes();
  }
}).catch(console.error);