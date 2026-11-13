import { z } from 'zod';

export const farmSchema = z.object({
  userId: z.string().min(1).default('farmer-demo-user'),
  farmName: z.string().min(2, 'Farm name must have at least 2 characters').max(150),
  locationRegion: z.string().min(2, 'Location / region is required').max(150),
  soilType: z.enum(['Clay', 'Loam', 'Sandy', 'Silt', 'Peaty', 'Chalky', 'Salty']),
  soilPh: z.coerce.number().min(3.5, 'Soil pH must be >= 3.5').max(10.0, 'Soil pH must be <= 10.0'),
  totalAreaAcres: z.coerce.number().positive('Total area in acres must be greater than zero'),
  irrigationType: z.enum(['Rainfed', 'Drip', 'Sprinkler', 'Flood', 'Canal']),
  primaryCrops: z.array(z.string()).min(1, 'Specify at least one primary crop')
});

export const advisoryAIResponseSchema = z.object({
  diagnosisTitle: z.string(),
  confidenceScore: z.number().int().min(0).max(100),
  severityLevel: z.enum(['Low', 'Moderate', 'High', 'Critical']),
  issueCategory: z.string(),
  organicRemedies: z.array(z.object({
    treatmentName: z.string(),
    applicationMethod: z.string(),
    dosageOrRate: z.string()
  })),
  chemicalTreatments: z.array(z.object({
    activeIngredient: z.string(),
    tradeNameExample: z.string(),
    safetyPrecautions: z.string(),
    applicationRate: z.string()
  })),
  preventativeMeasures: z.array(z.string()),
  fertilizerRecommendation: z.object({
    primaryNutrientFocus: z.string(),
    recommendedNPK: z.string(),
    applicationTiming: z.string()
  }),
  estimatedYieldImpact: z.string()
});

export const advisorySubmissionSchema = z.object({
  farmId: z.string().optional().nullable(),
  cropName: z.string().min(1, 'Crop name is required'),
  symptomDescription: z.string().min(3, 'Please describe symptoms in at least 3 characters'),
  region: z.string().optional(),
  soilType: z.string().optional(),
  soilPh: z.coerce.number().optional(),
  irrigationType: z.string().optional()
});
