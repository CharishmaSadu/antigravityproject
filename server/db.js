import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import os from 'os';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pool = null;
let isPgConnected = false;
let dbInitPromise = null;

// Determine writable data dir (on Vercel / serverless lambda, use os.tmpdir())
const DATA_DIR = process.env.VERCEL ? os.tmpdir() : path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'agriassist_store.json');
let inMemoryStore = null;

const INITIAL_DATA = {
  farms: [
    {
      id: 'f1a9b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
      user_id: 'farmer-demo-user',
      farm_name: 'Verdant Valley Agro Estate',
      location_region: 'Central Valley, California',
      soil_type: 'Loam',
      soil_ph: 6.8,
      total_area_acres: 45.5,
      irrigation_type: 'Drip',
      primary_crops: ['Tomato', 'Corn', 'Soybeans'],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
    },
    {
      id: 'f2b8c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
      user_id: 'farmer-demo-user',
      farm_name: 'Highland Organic Orchards',
      location_region: 'Willamette Valley, Oregon',
      soil_type: 'Silt',
      soil_ph: 6.2,
      total_area_acres: 28.0,
      irrigation_type: 'Sprinkler',
      primary_crops: ['Potato', 'Onion', 'Wheat'],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString()
    }
  ],
  advisories: [
    {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      farm_id: 'f1a9b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
      user_id: 'farmer-demo-user',
      crop_name: 'Tomato',
      symptom_description: 'Dark concentric target-shaped spots with chlorotic yellow halos on lower older leaves. Marginal foliar necrosis spreading upwards.',
      image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=600&q=80',
      diagnosis_title: 'Early Blight (Alternaria solani)',
      confidence_score: 94,
      severity_level: 'Moderate',
      issue_category: 'Fungal',
      organic_remedies: [
        {
          treatmentName: 'Bio-Fungicide Bacillus subtilis (Serenade ASO)',
          applicationMethod: 'Foliar spray with thorough coverage on both leaf undersides and canopies',
          dosageOrRate: '2 to 4 quarts per 100 gallons water every 7-10 days'
        },
        {
          treatmentName: 'Copper Octanoate (Copper Soap)',
          applicationMethod: 'Foliar application at dawn or late dusk to prevent phytotoxicity',
          dosageOrRate: '1.5 to 2.0 fluid ounces per gallon of water'
        }
      ],
      chemicalTreatments: [
        {
          activeIngredient: 'Azoxystrobin + Difenoconazole',
          tradeNameExample: 'Quadris Top / Amistar Top',
          safetyPrecautions: 'Wear PPE, observe 14-day pre-harvest interval (PHI), avoid aquatic runoff',
          applicationRate: '8 to 14 fl oz/acre'
        },
        {
          activeIngredient: 'Chlorothalonil',
          tradeNameExample: 'Bravo Weather Stik',
          safetyPrecautions: 'Contact protectant; 7-day reentry interval in dense foliage',
          applicationRate: '1.5 to 2.0 pints/acre'
        }
      ],
      preventativeMeasures: [
        'Prune lower 12 inches of infected leaves to enhance ventilation and diminish soil splash-up',
        'Switch strictly to drip irrigation rather than overhead sprinklers to minimize leaf moisture duration',
        'Apply organic straw mulch around plant bases to seal fungal spores in soil',
        'Practice a minimum 3-year crop rotation out of the Solanaceae family'
      ],
      fertilizerRecommendation: {
        primaryNutrientFocus: 'Potassium and Silica foliar fortification to thicken leaf epidermal cell walls',
        recommendedNPK: 'NPK 8-16-36 during fruiting; avoid excess quick-release nitrogen',
        applicationTiming: 'Split fertigation through drip weekly'
      },
      estimatedYieldImpact: 'Manageable: 5-10% potential loss if controlled within 7 days; up to 40% if untreated.',
      raw_ai_response: null,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
    }
  ]
};

function ensureStoreFile() {
  if (inMemoryStore) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Note: Persistent file storage unavailable; utilizing in-memory state:', err.message);
    if (!inMemoryStore) inMemoryStore = JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function readStore() {
  if (inMemoryStore) return inMemoryStore;
  ensureStoreFile();
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (!inMemoryStore) inMemoryStore = JSON.parse(JSON.stringify(INITIAL_DATA));
    return inMemoryStore;
  }
}

function writeStore(data) {
  if (inMemoryStore) {
    inMemoryStore = data;
    return;
  }
  ensureStoreFile();
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    inMemoryStore = data;
  }
}

export async function initDb() {
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.includes('user:password@localhost')) {
      console.log('ℹ️  No external PostgreSQL DATABASE_URL configured or default placeholder used.');
      console.log('📁 Using resilient embedded/file persistence for local development and offline preview.');
      ensureStoreFile();
      return { type: 'file' };
    }

    try {
      const isSupabase = dbUrl.includes('supabase.com') || dbUrl.includes('supabase.co');
      pool = new Pool({
        connectionString: dbUrl,
        ssl: (process.env.NODE_ENV === 'production' || isSupabase) ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 5000
      });

      // Test connection
      const client = await pool.connect();
      try {
        console.log('✅ PostgreSQL connection established successfully.');
        isPgConnected = true;

        // Run automated migrations from migrate.sql
        const sqlPath = path.join(__dirname, 'migrate.sql');
        if (fs.existsSync(sqlPath)) {
          const sql = fs.readFileSync(sqlPath, 'utf-8');
          await client.query(sql);
          console.log('✅ PostgreSQL database migrations applied successfully.');
        }
        return { type: 'postgres' };
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('⚠️  PostgreSQL connection failed:', err.message);
      console.log('📁 Falling back to resilient local JSON store so application stays fully operational.');
      isPgConnected = false;
      ensureStoreFile();
      return { type: 'file' };
    }
  })();

  return dbInitPromise;
}

export const db = {
  isPostgres: () => isPgConnected,

  async getFarms(userId = 'farmer-demo-user') {
    await initDb();
    if (isPgConnected && pool) {
      const result = await pool.query(
        'SELECT * FROM farms WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    }

    const store = readStore();
    return store.farms
      .filter((f) => f.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getFarmById(id, userId = 'farmer-demo-user') {
    await initDb();
    if (isPgConnected && pool) {
      const result = await pool.query(
        'SELECT * FROM farms WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      return result.rows[0] || null;
    }

    const store = readStore();
    return store.farms.find((f) => f.id === id && f.user_id === userId) || null;
  },

  async createFarm(farmData) {
    await initDb();
    const id = farmData.id || uuidv4();
    const now = new Date().toISOString();

    if (isPgConnected && pool) {
      const result = await pool.query(
        `INSERT INTO farms (
          id, user_id, farm_name, location_region, soil_type, 
          soil_ph, total_area_acres, irrigation_type, primary_crops, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          id,
          farmData.userId || 'farmer-demo-user',
          farmData.farmName,
          farmData.locationRegion,
          farmData.soilType,
          farmData.soilPh,
          farmData.totalAreaAcres,
          farmData.irrigationType,
          farmData.primaryCrops,
          now,
          now
        ]
      );
      return result.rows[0];
    }

    const store = readStore();
    const newFarm = {
      id,
      user_id: farmData.userId || 'farmer-demo-user',
      farm_name: farmData.farmName,
      location_region: farmData.locationRegion,
      soil_type: farmData.soilType,
      soil_ph: Number(farmData.soilPh),
      total_area_acres: Number(farmData.totalAreaAcres),
      irrigation_type: farmData.irrigationType,
      primary_crops: farmData.primaryCrops,
      created_at: now,
      updated_at: now
    };
    store.farms.unshift(newFarm);
    writeStore(store);
    return newFarm;
  },

  async getAdvisories({ userId = 'farmer-demo-user', farmId = null, search = '', severity = '', issueCategory = '', page = 1, limit = 20 } = {}) {
    await initDb();
    if (isPgConnected && pool) {
      const conditions = ['a.user_id = $1'];
      const params = [userId];
      let paramIndex = 2;

      if (farmId) {
        conditions.push(`a.farm_id = $${paramIndex++}`);
        params.push(farmId);
      }
      if (severity) {
        conditions.push(`LOWER(a.severity_level) = LOWER($${paramIndex++})`);
        params.push(severity);
      }
      if (issueCategory) {
        conditions.push(`LOWER(a.issue_category) = LOWER($${paramIndex++})`);
        params.push(issueCategory);
      }
      if (search) {
        conditions.push(`(a.diagnosis_title ILIKE $${paramIndex} OR a.crop_name ILIKE $${paramIndex} OR a.symptom_description ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      const offset = (page - 1) * limit;
      const countSql = `SELECT COUNT(*) FROM advisories a WHERE ${conditions.join(' AND ')}`;
      const dataSql = `
        SELECT a.*, f.farm_name, f.location_region 
        FROM advisories a 
        LEFT JOIN farms f ON a.farm_id = f.id 
        WHERE ${conditions.join(' AND ')} 
        ORDER BY a.created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;

      const [countRes, dataRes] = await Promise.all([
        pool.query(countSql, params.slice(0, paramIndex - 3)),
        pool.query(dataSql, [...params, limit, offset])
      ]);

      const total = parseInt(countRes.rows[0].count, 10);
      return {
        data: dataRes.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }

    const store = readStore();
    let list = store.advisories.filter((a) => a.user_id === userId);

    if (farmId) {
      list = list.filter((a) => a.farm_id === farmId);
    }
    if (severity) {
      list = list.filter((a) => a.severity_level.toLowerCase() === severity.toLowerCase());
    }
    if (issueCategory) {
      list = list.filter((a) => a.issue_category.toLowerCase() === issueCategory.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.diagnosis_title.toLowerCase().includes(q) ||
          a.crop_name.toLowerCase().includes(q) ||
          a.symptom_description.toLowerCase().includes(q)
      );
    }

    // Enrich with farm info
    const enriched = list.map((adv) => {
      const farm = store.farms.find((f) => f.id === adv.farm_id);
      return {
        ...adv,
        farm_name: farm ? farm.farm_name : 'Unknown Farm',
        location_region: farm ? farm.location_region : 'Standard Region'
      };
    });

    enriched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = enriched.length;
    const offset = (page - 1) * limit;
    const paginated = enriched.slice(offset, offset + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  async getAdvisoryById(id, userId = 'farmer-demo-user') {
    await initDb();
    if (isPgConnected && pool) {
      const result = await pool.query(
        `SELECT a.*, f.farm_name, f.location_region, f.soil_type, f.soil_ph, f.irrigation_type 
         FROM advisories a 
         LEFT JOIN farms f ON a.farm_id = f.id 
         WHERE a.id = $1 AND a.user_id = $2`,
        [id, userId]
      );
      return result.rows[0] || null;
    }

    const store = readStore();
    const adv = store.advisories.find((a) => a.id === id && a.user_id === userId);
    if (!adv) return null;

    const farm = store.farms.find((f) => f.id === adv.farm_id);
    return {
      ...adv,
      farm_name: farm ? farm.farm_name : 'Custom / Unassigned Farm',
      location_region: farm ? farm.location_region : 'General Climate Zone',
      soil_type: farm ? farm.soil_type : 'Loam',
      soil_ph: farm ? farm.soil_ph : 6.5,
      irrigation_type: farm ? farm.irrigation_type : 'Drip'
    };
  },

  async createAdvisory(data) {
    await initDb();
    const id = data.id || uuidv4();
    const now = new Date().toISOString();

    if (isPgConnected && pool) {
      const result = await pool.query(
        `INSERT INTO advisories (
          id, farm_id, user_id, crop_name, symptom_description, image_url,
          diagnosis_title, confidence_score, severity_level, issue_category,
          organic_remedies, chemical_treatments, preventative_measures,
          fertilizer_recommendation, estimated_yield_impact, raw_ai_response, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17
        ) RETURNING *`,
        [
          id,
          data.farmId || null,
          data.userId || 'farmer-demo-user',
          data.cropName,
          data.symptomDescription,
          data.imageUrl || null,
          data.diagnosisTitle,
          data.confidenceScore,
          data.severityLevel,
          data.issueCategory,
          JSON.stringify(data.organicRemedies),
          JSON.stringify(data.chemicalTreatments),
          JSON.stringify(data.preventativeMeasures),
          JSON.stringify(data.fertilizerRecommendation),
          data.estimatedYieldImpact,
          JSON.stringify(data.rawAiResponse || {}),
          now
        ]
      );
      return result.rows[0];
    }

    const store = readStore();
    const newAdv = {
      id,
      farm_id: data.farmId || null,
      user_id: data.userId || 'farmer-demo-user',
      crop_name: data.cropName,
      symptom_description: data.symptomDescription,
      image_url: data.imageUrl || null,
      diagnosis_title: data.diagnosisTitle,
      confidence_score: data.confidenceScore,
      severity_level: data.severityLevel,
      issue_category: data.issueCategory,
      organic_remedies: data.organicRemedies,
      chemical_treatments: data.chemicalTreatments,
      preventative_measures: data.preventativeMeasures,
      fertilizer_recommendation: data.fertilizerRecommendation,
      estimated_yield_impact: data.estimatedYieldImpact,
      raw_ai_response: data.rawAiResponse || null,
      created_at: now
    };
    store.advisories.unshift(newAdv);
    writeStore(store);
    return newAdv;
  }
};
