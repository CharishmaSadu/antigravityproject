import { Router } from 'express';
import { db } from '../db.js';
import { farmSchema } from '../validators/index.js';

const router = Router();

// GET /api/farms - List all farms for user
router.get('/', async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || 'farmer-demo-user';
    const farms = await db.getFarms(userId);
    res.json({
      success: true,
      count: farms.length,
      data: farms
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/farms/:id - Retrieve specific farm details & linked advisories
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || 'farmer-demo-user';
    const farm = await db.getFarmById(req.params.id, userId);

    if (!farm) {
      return res.status(404).json({
        success: false,
        error: 'Farm profile not found or unauthorized'
      });
    }

    const linkedAdvisories = await db.getAdvisories({
      userId,
      farmId: farm.id,
      limit: 10
    });

    res.json({
      success: true,
      data: {
        ...farm,
        advisories: linkedAdvisories.data
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/farms - Create new farm profile
router.post('/', async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId || 'farmer-demo-user';
    const validatedData = farmSchema.parse({
      ...req.body,
      userId
    });

    const createdFarm = await db.createFarm(validatedData);

    res.status(201).json({
      success: true,
      message: 'Farm profile registered successfully',
      data: createdFarm
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: err.errors
      });
    }
    next(err);
  }
});

export default router;
