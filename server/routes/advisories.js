import { Router } from 'express';
import multer from 'multer';
import { db } from '../db.js';
import { generateCropAdvisory } from '../services/gemini.js';
import { advisorySubmissionSchema } from '../validators/index.js';
import { uploadCropImage } from '../services/supabase.js';

const router = Router();

// Multer in-memory upload configuration with strict security rules
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are permitted.'));
    }
  }
});

// GET /api/advisories - List historical advisories with pagination & filtering
router.get('/', async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || 'farmer-demo-user';
    const { farmId, search, severity, issueCategory, page = 1, limit = 20 } = req.query;

    const result = await db.getAdvisories({
      userId,
      farmId: farmId ? String(farmId) : null,
      search: search ? String(search) : '',
      severity: severity ? String(severity) : '',
      issueCategory: issueCategory ? String(issueCategory) : '',
      page: parseInt(String(page), 10) || 1,
      limit: parseInt(String(limit), 10) || 20
    });

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/advisories/:id - Retrieve single detailed advisory report
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || 'farmer-demo-user';
    const advisory = await db.getAdvisoryById(req.params.id, userId);

    if (!advisory) {
      return res.status(404).json({
        success: false,
        error: 'Advisory report not found or unauthorized'
      });
    }

    res.json({
      success: true,
      data: advisory
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/advisories - Submit text & optional image query for Gemini analysis
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || 'farmer-demo-user';
    
    // Validate request inputs
    const validated = advisorySubmissionSchema.parse(req.body);

    let region = validated.region || 'Standard Agricultural Zone';
    let soilType = validated.soilType || 'Loam';
    let soilPh = validated.soilPh ? Number(validated.soilPh) : 6.5;
    let irrigationType = validated.irrigationType || 'Drip';

    // If farmId is attached, inherit rich farm environmental parameters
    if (validated.farmId) {
      const linkedFarm = await db.getFarmById(validated.farmId, userId);
      if (linkedFarm) {
        region = linkedFarm.location_region || region;
        soilType = linkedFarm.soil_type || soilType;
        soilPh = Number(linkedFarm.soil_ph) || soilPh;
        irrigationType = linkedFarm.irrigation_type || irrigationType;
      }
    }

    // Process image: Upload to Supabase Storage if configured, else fallback to data URL
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadCropImage(req.file.buffer, req.file.originalname, req.file.mimetype);
      if (!imageUrl) {
        const base64 = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
      }
    }

    // Call Gemini 2.5 Flash / Agronomic Service
    const aiResult = await generateCropAdvisory({
      cropName: validated.cropName,
      symptomDescription: validated.symptomDescription,
      region,
      soilType,
      soilPh,
      irrigationType,
      imageFile: req.file || null
    });

    const advisoryData = aiResult.advisory;

    // Persist to PostgreSQL / Data store
    const savedRecord = await db.createAdvisory({
      farmId: validated.farmId || null,
      userId,
      cropName: validated.cropName,
      symptomDescription: validated.symptomDescription,
      imageUrl,
      diagnosisTitle: advisoryData.diagnosisTitle,
      confidenceScore: advisoryData.confidenceScore,
      severityLevel: advisoryData.severityLevel,
      issueCategory: advisoryData.issueCategory,
      organicRemedies: advisoryData.organicRemedies,
      chemicalTreatments: advisoryData.chemicalTreatments,
      preventativeMeasures: advisoryData.preventativeMeasures,
      fertilizerRecommendation: advisoryData.fertilizerRecommendation,
      estimatedYieldImpact: advisoryData.estimatedYieldImpact,
      rawAiResponse: {
        source: aiResult.source,
        warning: aiResult.warning || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Agronomic advisory generated and cataloged successfully',
      source: aiResult.source,
      data: savedRecord
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: err.errors
      });
    }
    if (err.message && err.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    next(err);
  }
});

export default router;
