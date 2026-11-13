import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🌱 ========================================================
   AgriAssist AI - Crop Advisory Server Running
   Port: ${PORT}
   Mode: ${process.env.NODE_ENV || 'development'}
   API Health: http://localhost:${PORT}/api/health
   Farms API:  http://localhost:${PORT}/api/farms
🌱 ========================================================
  `);
});
