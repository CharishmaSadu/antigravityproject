import { GoogleGenAI } from '@google/genai';
import { advisoryAIResponseSchema } from '../validators/index.js';

const SYSTEM_PROMPT = `You are AgriAssist AI, a world-class Principal Agronomist and Plant Pathologist with 30+ years of field experience across global agricultural zones. Your role is to analyze farmer queries, descriptions, and crop photographs with extreme precision. 

Provide scientifically validated, environmentally responsible, and economically sensible advice. Distinguish clearly between symptoms of nutrient deficiency, fungal infections, bacterial blights, viral vectors, and pest damage. Always provide both organic/biological control options and conventional chemical treatments with precise application warnings and safety intervals. 

You must output your complete analysis strictly in the requested JSON structure without markdown formatting wrappers outside the schema.`;

// Comprehensive expert agronomy engine for offline / testing / fallback when API key is missing or quota exceeded
const AGRONOMY_EXPERT_CATALOG = [
  {
    keywords: ['yellow', 'chlorosis', 'vein', 'nitrogen', 'pale', 'deficiency', 'stunted'],
    crop: 'general',
    data: {
      diagnosisTitle: 'Nitrogen (N) Deficiency Chlorosis & Vegetative Stunting',
      confidenceScore: 89,
      severityLevel: 'Moderate',
      issueCategory: 'Nutrient Deficiency',
      organicRemedies: [
        {
          treatmentName: 'Blood Meal & Feather Meal Top-Dressing',
          applicationMethod: 'Broadcast around root dripline and gently incorporate into top 2 inches of soil',
          dosageOrRate: '3 to 5 lbs per 100 sq ft or 250 kg/hectare'
        },
        {
          treatmentName: 'Aerated Compost Tea + Fish Hydrolysate Foliar',
          applicationMethod: 'Foliar spray with fine nozzle during early morning overcast periods',
          dosageOrRate: '2 gallons per acre diluted 1:20 with non-chlorinated water'
        }
      ],
      chemicalTreatments: [
        {
          activeIngredient: 'Urea (46-0-0) / Calcium Ammonium Nitrate (CAN-27)',
          tradeNameExample: 'YaraBela CAN / Agrium Urea 46N',
          safetyPrecautions: 'Apply before irrigation or rain to prevent volatilization loss; wear protective gloves and eye wear',
          applicationRate: '40-60 kg actual N per acre split into 2 applications'
        }
      ],
      preventativeMeasures: [
        'Perform annual pre-plant soil nitrate testing (PSNT) before planting',
        'Incorporate leguminous green manure crops (Hairy Vetch or Crimson Clover) in off-season',
        'Maintain balanced organic matter above 3.5% to retain mineralized nitrogen'
      ],
      fertilizerRecommendation: {
        primaryNutrientFocus: 'Rapid vegetative nitrogen correction supported by balanced sulfur',
        recommendedNPK: 'NPK 20-10-10 or 15-5-10 with 3% Sulfur',
        applicationTiming: 'Side-dress immediately at active vegetative growth stage'
      },
      estimatedYieldImpact: 'Reversible: 10-15% potential yield reduction if unaddressed within 14 days.'
    }
  },
  {
    keywords: ['spot', 'concentric', 'blight', 'target', 'alternaria', 'brown', 'black', 'ring'],
    crop: 'Tomato',
    data: {
      diagnosisTitle: 'Early Blight (Alternaria solani) with Secondary Foliar Necrosis',
      confidenceScore: 93,
      severityLevel: 'High',
      issueCategory: 'Fungal',
      organicRemedies: [
        {
          treatmentName: 'Bacillus subtilis Bio-fungicide (Strain QST 713)',
          applicationMethod: 'High-pressure canopy spray ensuring undersides of lower foliage are drenched',
          dosageOrRate: '2 to 4 quarts per 100 gallons per acre every 7 days'
        },
        {
          treatmentName: 'Fixed Copper Soap (Copper Octanoate)',
          applicationMethod: 'Foliar application at canopy level under low UV conditions',
          dosageOrRate: '1.5 fl oz per gallon of water'
        }
      ],
      chemicalTreatments: [
        {
          activeIngredient: 'Azoxystrobin + Difenoconazole',
          tradeNameExample: 'Quadris Top SC',
          safetyPrecautions: '14-day pre-harvest interval; rotate FRAC mode-of-action groups 11 and 3 to hinder resistance',
          applicationRate: '8.0 to 14.0 fl oz per acre'
        },
        {
          activeIngredient: 'Chlorothalonil',
          tradeNameExample: 'Bravo Weather Stik',
          safetyPrecautions: 'Multi-site contact protectant; apply before spore germination events',
          applicationRate: '1.5 to 2.0 pints per acre'
        }
      ],
      preventativeMeasures: [
        'Strip bottom 12-16 inches of lateral leaves to eliminate ground splash',
        'Enforce drip irrigation; eliminate all overhead watering after transplant establishment',
        'Sterilize pruning shears with 10% bleach between field rows',
        'Maintain 3-year Solanaceae crop rotation schedule'
      ],
      fertilizerRecommendation: {
        primaryNutrientFocus: 'Potassium foliar boost and bio-silicon to fortify parenchymal cell walls',
        recommendedNPK: 'NPK 12-12-36 with 2% Magnesium Oxide',
        applicationTiming: 'Weekly fertigation through drip irrigation line'
      },
      estimatedYieldImpact: 'Significant: 25-35% harvest loss if defoliation reaches upper flowering cluster.'
    }
  },
  {
    keywords: ['water', 'wilt', 'bacterial', 'slime', 'ooze', 'vascular', 'stem'],
    crop: 'general',
    data: {
      diagnosisTitle: 'Bacterial Wilt & Vascular Crown Infection (Ralstonia solanacearum)',
      confidenceScore: 88,
      severityLevel: 'Critical',
      issueCategory: 'Bacterial',
      organicRemedies: [
        {
          treatmentName: 'Streptomyces lydicus (Actinovate AG) Bio-bactericide',
          applicationMethod: 'Soil drench around root collar and furrow',
          dosageOrRate: '6 to 12 oz per acre in 50 gallons drench water'
        },
        {
          treatmentName: 'Bio-fumigation with Mustard Seed Meal',
          applicationMethod: 'Tilled into topsoil followed by plastic solarization tarp for 3 weeks',
          dosageOrRate: '1.5 tons per hectare prior to replanting'
        }
      ],
      chemicalTreatments: [
        {
          activeIngredient: 'Copper Hydroxide + Kasugamycin (where registered)',
          tradeNameExample: 'Kocide 3000 / Kasumin 2L',
          safetyPrecautions: 'Protective goggles, neoprene gloves, 48-hr REI; avoid alkaline water mixes',
          applicationRate: '1.25 to 2.0 lbs per acre'
        }
      ],
      preventativeMeasures: [
        'Immediately rogue and incinerate severely wilted plants including root ball',
        'Disinfect irrigation drip lines with hydrogen dioxide / peroxyacetic acid',
        'Improve field drainage to eliminate waterlogged low spots where Ralstonia thrives',
        'Plant certified disease-free grafted rootstocks (e.g., Maxifort)'
      ],
      fertilizerRecommendation: {
        primaryNutrientFocus: 'Calcium nitrate soil amendment to strengthen cell wall pectins',
        recommendedNPK: 'NPK 10-5-20 with 15% soluble Calcium',
        applicationTiming: 'Apply through drip; strictly avoid ammonium-based nitrogen forms'
      },
      estimatedYieldImpact: 'Critical: Up to 60-80% localized field loss if systemic vascular collapse occurs.'
    }
  },
  {
    keywords: ['mosaic', 'curl', 'mottling', 'vector', 'whitefly', 'aphid', 'viral'],
    crop: 'general',
    data: {
      diagnosisTitle: 'Viral Mosaic Complex & Begomovirus Foliar Deformation',
      confidenceScore: 91,
      severityLevel: 'High',
      issueCategory: 'Viral',
      organicRemedies: [
        {
          treatmentName: 'Cold-Pressed Horticultural Neem Oil (Azadirachtin 1%)',
          applicationMethod: 'Targeted spraying on underside of leaves to suppress aphid/whitefly vectors',
          dosageOrRate: '1.0% to 1.5% concentration in water with non-ionic surfactant'
        },
        {
          treatmentName: 'Yellow Sticky Traps & Silver Reflective Mulch',
          applicationMethod: 'Install 40 traps per acre at canopy height to disrupt insect vector orientation',
          dosageOrRate: '40-60 traps per acre distributed evenly'
        }
      ],
      chemicalTreatments: [
        {
          activeIngredient: 'Spirotetramat / Flupyradifurone',
          tradeNameExample: 'Movento / Sivanto Prime',
          safetyPrecautions: 'Fully systemic 2-way phloem mobility; observe bee-safety pollinator restrictions',
          applicationRate: '5.0 to 10.0 fl oz per acre'
        }
      ],
      preventativeMeasures: [
        'Eradicate weed reservoir hosts (Black Nightshade, Datura, Amaranthus) in perimeter',
        'Install 50-mesh insect-proof screening over nursery seedbeds',
        'Select resistant F1 hybrid cultivars containing Ty-1/Ty-3 resistance genes'
      ],
      fertilizerRecommendation: {
        primaryNutrientFocus: 'Micronutrient foliar blend (Zinc, Boron, Manganese) to support enzymatic recovery',
        recommendedNPK: 'Chelated Micronutrient foliar spray (Zn 4%, Fe 3%, Mn 2%, B 1%)',
        applicationTiming: 'Bi-weekly foliar misting'
      },
      estimatedYieldImpact: 'Substantial: 30-50% fruit distortion and size reduction if infected early.'
    }
  },
  {
    keywords: ['chewing', 'holes', 'worm', 'caterpillar', 'larvae', 'borer', 'frass', 'pest'],
    crop: 'general',
    data: {
      diagnosisTitle: 'Lepidopteran Foliar Pest Infestation (Fall Armyworm / Helicoverpa)',
      confidenceScore: 95,
      severityLevel: 'High',
      issueCategory: 'Pest',
      organicRemedies: [
        {
          treatmentName: 'Bacillus thuringiensis var. kurstaki (Bt DiPel DF)',
          applicationMethod: 'Spray late afternoon when young instars feed actively; cover whorls thoroughly',
          dosageOrRate: '0.5 to 1.0 lb per acre in 30 gallons water'
        },
        {
          treatmentName: 'Spinosad Bio-insecticide (Entrust SC)',
          applicationMethod: 'Directed spray into plant canopy and leaf axils',
          dosageOrRate: '1.5 to 3.0 fl oz per acre'
        }
      ],
      chemicalTreatments: [
        {
          activeIngredient: 'Chlorantraniliprole (Diamide)',
          tradeNameExample: 'Coragen 20 SC / Prevathon',
          safetyPrecautions: 'Ryanodine receptor modulator; safe for beneficial parasitoid wasps; 1-day PHI',
          applicationRate: '3.5 to 5.0 fl oz per acre'
        },
        {
          activeIngredient: 'Emamectin Benzoate',
          tradeNameExample: 'Proclaim 5 SG',
          safetyPrecautions: 'Wear chemical-resistant suit; toxic to bees within 4 hours of wet spray',
          applicationRate: '80 grams per acre'
        }
      ],
      preventativeMeasures: [
        'Deploy sex-pheromone monitoring traps (4 per acre) to time egg-hatch intervention',
        'Release Trichogramma parasitic micro-wasps at initial moth detection',
        'Deep plow crop residue after harvest to expose overwintering pupae to predators'
      ],
      fertilizerRecommendation: {
        primaryNutrientFocus: 'Silicon and balanced potassium to strengthen leaf cuticle resistance to biting larvae',
        recommendedNPK: 'NPK 15-15-15 with Potassium Silicate supplement',
        applicationTiming: 'Normal vegetative top-dressing'
      },
      estimatedYieldImpact: 'Severe: 20-40% leaf area reduction leading to photosynthetic starvation.'
    }
  }
];

function generateFallbackAdvisory({ cropName, symptomDescription, region, soilType, soilPh, irrigationType }) {
  const query = `${cropName} ${symptomDescription}`.toLowerCase();
  
  // Find best matching expert record
  let match = AGRONOMY_EXPERT_CATALOG.find(cat => 
    cat.crop.toLowerCase() === cropName.toLowerCase() &&
    cat.keywords.some(k => query.includes(k))
  );

  if (!match) {
    match = AGRONOMY_EXPERT_CATALOG.find(cat => 
      cat.keywords.some(k => query.includes(k))
    );
  }

  if (!match) {
    match = AGRONOMY_EXPERT_CATALOG[0]; // Nitrogen/chlorosis default
  }

  const base = JSON.parse(JSON.stringify(match.data));
  base.diagnosisTitle = `${cropName} - ${base.diagnosisTitle}`;
  return base;
}

export async function generateCropAdvisory({
  cropName,
  symptomDescription,
  region = 'Temperate Agricultural Belt',
  soilType = 'Loam',
  soilPh = 6.5,
  irrigationType = 'Drip',
  imageFile = null
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasValidApiKey = apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_google_gemini_api_key');

  if (!hasValidApiKey) {
    console.log('ℹ️  GEMINI_API_KEY not set or placeholder detected. Invoking AgriAssist AI Expert Knowledge Engine.');
    const fallback = generateFallbackAdvisory({
      cropName,
      symptomDescription,
      region,
      soilType,
      soilPh,
      irrigationType
    });
    return {
      advisory: advisoryAIResponseSchema.parse(fallback),
      source: 'expert_knowledge_engine'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const promptText = `Analyze the following agricultural case and provide a rigorous diagnostic advisory:
- Crop Name: ${cropName}
- Region / Climate: ${region}
- Soil Type: ${soilType} (pH: ${soilPh})
- Irrigation: ${irrigationType}
- Farmer Description / Symptoms: ${symptomDescription}
- Image Provided: ${imageFile ? 'Yes (high-resolution leaf/field photograph attached)' : 'No'}

Return a valid JSON object adhering strictly to this schema:
{
  "diagnosisTitle": "string",
  "confidenceScore": number (0-100),
  "severityLevel": "Low" | "Moderate" | "High" | "Critical",
  "issueCategory": "Fungal" | "Bacterial" | "Viral" | "Pest" | "Nutrient Deficiency" | "Environmental" | "Healthy",
  "organicRemedies": [
    {
      "treatmentName": "string",
      "applicationMethod": "string",
      "dosageOrRate": "string"
    }
  ],
  "chemicalTreatments": [
    {
      "activeIngredient": "string",
      "tradeNameExample": "string",
      "safetyPrecautions": "string",
      "applicationRate": "string"
    }
  ],
  "preventativeMeasures": ["string"],
  "fertilizerRecommendation": {
    "primaryNutrientFocus": "string",
    "recommendedNPK": "string",
    "applicationTiming": "string"
  },
  "estimatedYieldImpact": "string"
}`;

    const contents = [];

    if (imageFile && imageFile.buffer) {
      contents.push({
        inlineData: {
          mimeType: imageFile.mimetype || 'image/jpeg',
          data: imageFile.buffer.toString('base64')
        }
      });
    }

    contents.push({
      text: promptText
    });

    console.log(`🤖 Invoking Gemini 2.5 Flash for ${cropName} advisory...`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    let rawText = response.text || '';
    rawText = rawText.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedJson = JSON.parse(rawText);
    const validated = advisoryAIResponseSchema.parse(parsedJson);

    return {
      advisory: validated,
      source: 'gemini_2_5_flash'
    };
  } catch (err) {
    console.error('⚠️  Gemini API call error:', err.message);
    console.log('🔄 Engaging AgriAssist AI agronomic fallback engine to safeguard service continuity.');
    const fallback = generateFallbackAdvisory({
      cropName,
      symptomDescription,
      region,
      soilType,
      soilPh,
      irrigationType
    });
    return {
      advisory: advisoryAIResponseSchema.parse(fallback),
      source: 'expert_knowledge_engine_fallback',
      warning: err.message
    };
  }
}
