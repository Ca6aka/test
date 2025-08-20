const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    // HTML content for receipt
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .receipt { background: white; padding: 40px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px; }
          .title { color: #2563eb; font-size: 28px; font-weight: bold; margin: 0; }
          .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
          .info-row { display: flex; justify-content: space-between; margin: 15px 0; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #111827; }
          .status { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #64748b; font-size: 12px; }
          .amount { font-size: 24px; font-weight: bold; color: #10b981; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1 class="title">📄 Документ об оплате</h1>
            <p class="subtitle">Server Simulation Game</p>
          </div>
          
          <div class="info-row">
            <span class="label">Заказ:</span>
            <span class="value">#TEST-VIP-123456</span>
          </div>
          
          <div class="info-row">
            <span class="label">Игрок:</span>
            <span class="value">TestUser123</span>
          </div>
          
          <div class="info-row">
            <span class="label">Тип подписки:</span>
            <span class="value">⭐ VIP статус</span>
          </div>
          
          <div class="info-row">
            <span class="label">Сумма:</span>
            <span class="value amount">$2.50</span>
          </div>
          
          <div class="info-row">
            <span class="label">Дата оплаты:</span>
            <span class="value">20.08.2025, 22:53:15</span>
          </div>
          
          <div class="info-row">
            <span class="label">Статус:</span>
            <span class="status">✅ Оплачено</span>
          </div>
          
          <div class="footer">
            <p>Спасибо за поддержку проекта Server Simulation Game!</p>
            <p>Документ сгенерирован: ${new Date().toLocaleString('ru-RU')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    // Generate screenshot
    await page.screenshot({ 
      path: 'receipt-screenshot.png', 
      fullPage: true,
      type: 'png'
    });
    
    // Generate PDF
    const pdf = await page.pdf({ 
      path: 'working-receipt.pdf',
      format: 'A4', 
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    await browser.close();
    
    console.log('✅ PDF и скриншот чека успешно созданы!');
    console.log('📄 PDF файл: working-receipt.pdf');
    console.log('📸 Скриншот: receipt-screenshot.png');
    
    // Check file sizes
    const pdfSize = fs.statSync('working-receipt.pdf').size;
    const pngSize = fs.statSync('receipt-screenshot.png').size;
    
    console.log('PDF размер:', pdfSize, 'байт');
    console.log('PNG размер:', pngSize, 'байт');
    
  } catch (error) {
    console.error('Ошибка генерации:', error);
  }
})();