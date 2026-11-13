export type SoilType = 'Clay' | 'Loam' | 'Sandy' | 'Silt' | 'Peaty' | 'Chalky' | 'Salty';

export type IrrigationType = 'Rainfed' | 'Drip' | 'Sprinkler' | 'Flood' | 'Canal';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type IssueCategory = 
  | 'Fungal' 
  | 'Bacterial' 
  | 'Viral' 
  | 'Pest' 
  | 'Nutrient Deficiency' 
  | 'Environmental' 
  | 'Healthy';

export interface Farm {
  id: string;
  user_id: string;
  farm_name: string;
  location_region: string;
  soil_type: SoilType;
  soil_ph: number;
  total_area_acres: number;
  irrigation_type: IrrigationType;
  primary_crops: string[];
  created_at: string;
  updated_at: string;
}

export interface OrganicRemedy {
  treatmentName: string;
  applicationMethod: string;
  dosageOrRate: string;
}

export interface ChemicalTreatment {
  activeIngredient: string;
  tradeNameExample: string;
  safetyPrecautions: string;
  applicationRate: string;
}

export interface FertilizerRecommendation {
  primaryNutrientFocus: string;
  recommendedNPK: string;
  applicationTiming: string;
}

export interface Advisory {
  id: string;
  farm_id?: string | null;
  farm_name?: string;
  location_region?: string;
  soil_type?: SoilType;
  soil_ph?: number;
  irrigation_type?: IrrigationType;
  user_id: string;
  crop_name: string;
  symptom_description: string;
  image_url?: string | null;
  diagnosis_title: string;
  confidence_score: number;
  severity_level: SeverityLevel;
  issue_category: IssueCategory | string;
  organic_remedies: OrganicRemedy[];
  chemical_treatments: ChemicalTreatment[];
  preventative_measures: string[];
  fertilizer_recommendation: FertilizerRecommendation;
  estimated_yield_impact: string;
  raw_ai_response?: any;
  created_at: string;
}

export interface WeatherDay {
  day: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainfallMm: number;
  rainfallProbability: number;
  windSpeedKmh: number;
  solarRadiationMj: number;
  diseaseRiskScore: number;
  sprayWindowSuitability: string;
}

export interface WeatherData {
  region: string;
  current: {
    temperature: number;
    condition: string;
    relativeHumidity: number;
    soilMoisturePercent: number;
    evapotranspirationMmDay: number;
    uvIndex: number;
    sprayAdvisory: string;
  };
  forecast: WeatherDay[];
}

export interface YieldAnalysis {
  cropName: string;
  unit: string;
  potentialYield: number;
  untreatedYield: number;
  treatedYield: number;
  yieldProtected: number;
  protectionPercentage: number;
  soilHealthScore: number;
  irrigationEfficiency: string;
  chartComparison: Array<{
    name: string;
    yield: number;
  }>;
}

export type SupportedLanguage = 'en' | 'es' | 'hi' | 'fr' | 'sw';
