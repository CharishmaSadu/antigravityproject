import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import farmsRouter from './routes/farms.js';
import advisoriesRouter from './routes/advisories.js';
import { getAgroWeather, calculateYieldForecast } from './services/weather.js';
import { db, initDb } from './db.js';
import { isSupabaseConfigured } from './services/supabase.js';

dotenv.config();

const app = express();

// Security and CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize DB on startup
initDb().catch(err => console.warn('Background DB initialization note:', err.message));

// Health check endpoint (matches both /api/health and /health for Vercel serverless)
app.get(['/api/health', '/health'], (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10);
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: db.isPostgres() ? 'PostgreSQL (Connected)' : 'Embedded Store (Resilient Fallback)',
    isSupabasePg: Boolean(process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('supabase.com') || process.env.DATABASE_URL.includes('supabase.co'))),
    supabaseClientConfigured: isSupabaseConfigured(),
    geminiSdkConfigured: hasGeminiKey,
    model: 'gemini-2.5-flash',
    version: '1.0.0'
  });
});

// Agro-meteorological weather endpoint
app.get(['/api/weather', '/weather'], (req, res) => {
  const region = req.query.region || 'Salinas Valley, California';
  const weatherData = getAgroWeather(String(region));
  res.json({
    success: true,
    data: weatherData
  });
});

// Dynamic yield forecasting analytics endpoint
app.get(['/api/analytics/yield', '/analytics/yield'], (req, res) => {
  const { crop = 'Tomato', soil = 'Loam', ph = 6.5, irrigation = 'Drip', severity = 'Moderate' } = req.query;
  const analysis = calculateYieldForecast({
    cropName: String(crop),
    soilType: String(soil),
    soilPh: Number(ph) || 6.5,
    irrigationType: String(irrigation),
    severityLevel: String(severity)
  });
  res.json({
    success: true,
    data: analysis
  });
});

// Main domain routes (support both /api/ prefix and bare route for Vercel)
app.use(['/api/farms', '/farms'], farmsRouter);
app.use(['/api/advisories', '/advisories'], advisoriesRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Express Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;
