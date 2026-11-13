export function getAgroWeather(region = 'Salinas Valley, CA') {
  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const baseTemp = 24;

  const forecast = days.map((day, idx) => {
    const tempMax = Math.round(baseTemp + (Math.sin(idx) * 4) + (idx % 2 === 0 ? 1 : -1));
    const tempMin = Math.round(tempMax - 9 - (idx % 3));
    const humidity = Math.min(95, Math.max(45, Math.round(68 + Math.cos(idx) * 18)));
    const rainfallMm = idx === 1 || idx === 4 ? Number((Math.random() * 8 + 2).toFixed(1)) : 0;
    const rainProb = rainfallMm > 0 ? Math.round(65 + Math.random() * 25) : Math.round(10 + Math.random() * 20);
    const windSpeed = Math.round(12 + Math.sin(idx * 2) * 6);
    
    // Disease risk score 0 - 100 based on leaf wetness, humidity, and temperature
    const diseaseRisk = Math.min(100, Math.max(15, Math.round((humidity * 0.6) + (rainfallMm * 4) + ((tempMax > 22 && tempMax < 30) ? 20 : 5))));

    return {
      day,
      tempMax,
      tempMin,
      humidity,
      rainfallMm,
      rainfallProbability: rainProb,
      windSpeedKmh: windSpeed,
      solarRadiationMj: Number((18.5 + Math.sin(idx) * 3).toFixed(1)),
      diseaseRiskScore: diseaseRisk,
      sprayWindowSuitability: windSpeed < 15 && rainProb < 30 ? 'Favorable' : rainProb > 50 ? 'Avoid (Rain Risk)' : 'Caution (Wind)'
    };
  });

  return {
    region,
    current: {
      temperature: 23.4,
      condition: 'Partly Cloudy / Optimal Growing Conditions',
      relativeHumidity: 65,
      soilMoisturePercent: 32.5,
      evapotranspirationMmDay: 4.8,
      uvIndex: 6.2,
      sprayAdvisory: 'Favorable spray window until 11:00 AM; wind speed < 11 km/h.'
    },
    forecast
  };
}

export function calculateYieldForecast({
  cropName = 'Tomato',
  soilType = 'Loam',
  soilPh = 6.5,
  irrigationType = 'Drip',
  severityLevel = 'Moderate'
}) {
  // Reference baseline yield in metric tons per acre
  const BASE_YIELDS = {
    tomato: 38.0,
    potato: 24.5,
    corn: 9.8,
    wheat: 3.6,
    rice: 4.5,
    soybeans: 2.8,
    cotton: 1.4,
    onion: 30.0,
    cabbage: 25.0
  };

  const cropKey = cropName.toLowerCase();
  const baseYield = BASE_YIELDS[cropKey] || 15.0;

  // Soil modifier
  const soilFactors = {
    Loam: 1.05,
    Silt: 1.0,
    Clay: 0.92,
    Sandy: 0.85,
    Peaty: 0.95,
    Chalky: 0.88,
    Salty: 0.70
  };
  const soilFactor = soilFactors[soilType] || 1.0;

  // pH modifier (optimal 6.0 - 7.0)
  let phFactor = 1.0;
  if (soilPh < 5.5 || soilPh > 8.0) {
    phFactor = 0.82;
  } else if (soilPh < 6.0 || soilPh > 7.5) {
    phFactor = 0.93;
  }

  // Irrigation factor
  const irrigationFactors = {
    Drip: 1.15,
    Sprinkler: 1.05,
    Canal: 0.98,
    Flood: 0.92,
    Rainfed: 0.80
  };
  const irrigationFactor = irrigationFactors[irrigationType] || 1.0;

  // Potential yield without disease
  const potentialYield = Number((baseYield * soilFactor * phFactor * irrigationFactor).toFixed(2));

  // Severity penalty
  const severityLosses = {
    Low: 0.08,
    Moderate: 0.22,
    High: 0.45,
    Critical: 0.75
  };
  const lossRate = severityLosses[severityLevel] || 0.20;

  const untreatedYield = Number((potentialYield * (1 - lossRate)).toFixed(2));
  // Yield with AgriAssist AI recommended treatment (recovers 85% of loss)
  const treatedYield = Number((potentialYield * (1 - (lossRate * 0.18))).toFixed(2));
  const yieldProtected = Number((treatedYield - untreatedYield).toFixed(2));
  const protectionPercentage = Math.round((yieldProtected / potentialYield) * 100);

  return {
    cropName,
    unit: 'Tons / Acre',
    potentialYield,
    untreatedYield,
    treatedYield,
    yieldProtected,
    protectionPercentage,
    soilHealthScore: Math.round(soilFactor * phFactor * 90),
    irrigationEfficiency: irrigationType === 'Drip' ? '92% (High)' : '75% (Standard)',
    chartComparison: [
      { name: 'Optimal Potential', yield: potentialYield },
      { name: 'Without Treatment', yield: untreatedYield },
      { name: 'With AgriAssist Protocol', yield: treatedYield }
    ]
  };
}
