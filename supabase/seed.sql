-- ==============================================================================
-- AgriAssist AI - Supabase Seed Data
-- ==============================================================================

INSERT INTO public.farms (
    id, user_id, farm_name, location_region, soil_type, 
    soil_ph, total_area_acres, irrigation_type, primary_crops
) VALUES 
(
    'f1a9b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
    'farmer-demo-user',
    'Verdant Valley Agro Estate',
    'Central Valley, California',
    'Loam',
    6.8,
    45.50,
    'Drip',
    ARRAY['Tomato', 'Corn', 'Soybeans']
),
(
    'f2b8c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'farmer-demo-user',
    'Highland Organic Orchards',
    'Willamette Valley, Oregon',
    'Silt',
    6.2,
    28.00,
    'Sprinkler',
    ARRAY['Potato', 'Onion', 'Wheat']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.advisories (
    id, farm_id, user_id, crop_name, symptom_description, image_url,
    diagnosis_title, confidence_score, severity_level, issue_category,
    organic_remedies, chemical_treatments, preventative_measures,
    fertilizer_recommendation, estimated_yield_impact, raw_ai_response
) VALUES 
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'f1a9b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
    'farmer-demo-user',
    'Tomato',
    'Dark concentric target-shaped spots with chlorotic yellow halos on lower older leaves. Marginal foliar necrosis spreading upwards.',
    'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=600&q=80',
    'Early Blight (Alternaria solani)',
    94,
    'Moderate',
    'Fungal',
    '[
      {
        "treatmentName": "Bio-Fungicide Bacillus subtilis (Serenade ASO)",
        "applicationMethod": "Foliar spray with thorough coverage on both leaf undersides and canopies",
        "dosageOrRate": "2 to 4 quarts per 100 gallons water every 7-10 days"
      },
      {
        "treatmentName": "Copper Octanoate (Copper Soap)",
        "applicationMethod": "Foliar application at dawn or late dusk to prevent phytotoxicity",
        "dosageOrRate": "1.5 to 2.0 fluid ounces per gallon of water"
      }
    ]'::jsonb,
    '[
      {
        "activeIngredient": "Azoxystrobin + Difenoconazole",
        "tradeNameExample": "Quadris Top / Amistar Top",
        "safetyPrecautions": "Wear PPE, observe 14-day pre-harvest interval (PHI), avoid aquatic runoff",
        "applicationRate": "8 to 14 fl oz/acre"
      },
      {
        "activeIngredient": "Chlorothalonil",
        "tradeNameExample": "Bravo Weather Stik",
        "safetyPrecautions": "Contact protectant; 7-day reentry interval in dense foliage",
        "applicationRate": "1.5 to 2.0 pints/acre"
      }
    ]'::jsonb,
    '[
      "Prune lower 12 inches of infected leaves to enhance ventilation and diminish soil splash-up",
      "Switch strictly to drip irrigation rather than overhead sprinklers to minimize leaf moisture duration",
      "Apply organic straw mulch around plant bases to seal fungal spores in soil",
      "Practice a minimum 3-year crop rotation out of the Solanaceae family"
    ]'::jsonb,
    '{
      "primaryNutrientFocus": "Potassium and Silica foliar fortification to thicken leaf epidermal cell walls",
      "recommendedNPK": "NPK 8-16-36 during fruiting; avoid excess quick-release nitrogen",
      "applicationTiming": "Split fertigation through drip weekly"
    }'::jsonb,
    'Manageable: 5-10% potential loss if controlled within 7 days; up to 40% if untreated.',
    '{"source": "expert_knowledge_engine"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
