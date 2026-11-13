import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  navDashboard: string;
  navNewAdvisory: string;
  navFarms: string;
  navHistory: string;
  ctaLaunch: string;
  ctaNewAdvisory: string;
  quickDiagnose: string;
  severityLow: string;
  severityModerate: string;
  severityHigh: string;
  severityCritical: string;
  organicRemedies: string;
  chemicalTreatments: string;
  preventativeMeasures: string;
  fertilizerPlan: string;
  estimatedYieldImpact: string;
  confidence: string;
  weatherAdvisory: string;
  yieldForecast: string;
  soilHealth: string;
  exportPdf: string;
  printReport: string;
  uploadLeafPhoto: string;
  dragDropPhoto: string;
  symptomPlaceholder: string;
  selectFarm: string;
  selectCrop: string;
  primaryCrops: string;
  soilPh: string;
  totalArea: string;
  irrigationType: string;
  submitConsultation: string;
  analyzingWithGemini: string;
  recentAdvisories: string;
  myFarms: string;
  noAdvisoriesYet: string;
  disclaimer: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'AgriAssist AI',
    tagline: 'Precision Crop Health & Agronomic Intelligence Powered by Google Gemini',
    navDashboard: 'Dashboard',
    navNewAdvisory: 'New Advisory',
    navFarms: 'Farm Profiles',
    navHistory: 'Consultation History',
    ctaLaunch: 'Launch Advisory Hub',
    ctaNewAdvisory: 'Request Crop Diagnosis',
    quickDiagnose: 'Instant AI Diagnosis',
    severityLow: 'Low Severity',
    severityModerate: 'Moderate Severity',
    severityHigh: 'High Severity',
    severityCritical: 'Critical Alert',
    organicRemedies: 'Organic & Biological Controls',
    chemicalTreatments: 'Targeted Chemical Remedies',
    preventativeMeasures: 'Preventative Cultural Practices',
    fertilizerPlan: 'Fertilizer & Nutrition Schedule',
    estimatedYieldImpact: 'Estimated Yield Impact',
    confidence: 'AI Diagnosis Confidence',
    weatherAdvisory: 'Agro-Meteorological Forecast',
    yieldForecast: 'Dynamic Yield Calculator',
    soilHealth: 'Soil Health Index',
    exportPdf: 'Export Advisory PDF',
    printReport: 'Print Report',
    uploadLeafPhoto: 'Upload Crop Leaf Photo',
    dragDropPhoto: 'Drag and drop high-resolution photo or click to browse (JPEG, PNG, WebP up to 5MB)',
    symptomPlaceholder: 'Describe leaf discoloration, lesion shapes, insect presence, wilting pattern, or duration of symptoms...',
    selectFarm: 'Select Farm Profile',
    selectCrop: 'Select Target Crop',
    primaryCrops: 'Primary Crops Cultivated',
    soilPh: 'Soil pH Level',
    totalArea: 'Total Area (Acres)',
    irrigationType: 'Irrigation System',
    submitConsultation: 'Analyze with Gemini AI',
    analyzingWithGemini: 'Processing leaf imagery and clinical agronomic diagnostics with Gemini 2.5 Flash...',
    recentAdvisories: 'Recent Consultations',
    myFarms: 'Active Farm Profiles',
    noAdvisoriesYet: 'No consultations recorded yet. Start your first crop diagnosis!',
    disclaimer: 'Scientific Agronomic Advisory: Recommendations are produced by AI models trained on agriscience literature. Always adhere to local pesticide registration guidelines and safety labels.'
  },
  es: {
    appName: 'AgriAssist AI',
    tagline: 'Inteligencia Agronómica y Salud de Cultivos Impulsada por Google Gemini',
    navDashboard: 'Tablero',
    navNewAdvisory: 'Nueva Asesoría',
    navFarms: 'Perfiles de Fincas',
    navHistory: 'Historial',
    ctaLaunch: 'Iniciar Asesor',
    ctaNewAdvisory: 'Diagnosticar Cultivo',
    quickDiagnose: 'Diagnóstico Rápido con IA',
    severityLow: 'Severidad Baja',
    severityModerate: 'Severidad Moderada',
    severityHigh: 'Alta Severidad',
    severityCritical: 'Alerta Crítica',
    organicRemedies: 'Controles Orgánicos y Biológicos',
    chemicalTreatments: 'Tratamientos Químicos Convencionales',
    preventativeMeasures: 'Prácticas Culturales Preventivas',
    fertilizerPlan: 'Plan de Fertilización y Nutrición',
    estimatedYieldImpact: 'Impacto Estimado en Rendimiento',
    confidence: 'Confianza del Diagnóstico',
    weatherAdvisory: 'Pronóstico Agroclimático',
    yieldForecast: 'Calculadora de Rendimiento',
    soilHealth: 'Índice de Salud del Suelo',
    exportPdf: 'Exportar Informe PDF',
    printReport: 'Imprimir Reporte',
    uploadLeafPhoto: 'Subir Foto de Hoja o Cultivo',
    dragDropPhoto: 'Arrastre una foto o haga clic para buscar (JPEG, PNG, WebP hasta 5MB)',
    symptomPlaceholder: 'Describa manchas foliares, presencia de plagas, marchitez o patrones de decoloración...',
    selectFarm: 'Seleccionar Finca',
    selectCrop: 'Seleccionar Cultivo',
    primaryCrops: 'Cultivos Principales',
    soilPh: 'Nivel de pH del Suelo',
    totalArea: 'Área Total (Acres)',
    irrigationType: 'Sistema de Riego',
    submitConsultation: 'Analizar con Gemini AI',
    analyzingWithGemini: 'Procesando imágenes y diagnóstico agronómico con Gemini 2.5 Flash...',
    recentAdvisories: 'Consultas Recientes',
    myFarms: 'Fincas Registradas',
    noAdvisoriesYet: 'Aún no hay consultas registradas. ¡Inicie su primer diagnóstico!',
    disclaimer: 'Aviso Agronómico: Las recomendaciones son generadas por modelos de IA especializados. Siga siempre las etiquetas y normativas locales de pesticidas.'
  },
  hi: {
    appName: 'AgriAssist AI',
    tagline: 'गूगल जेमिनी द्वारा संचालित उन्नत फसल स्वास्थ्य और कृषि सलाह प्रणाली',
    navDashboard: 'डैशबोर्ड',
    navNewAdvisory: 'नई सलाह',
    navFarms: 'खेत प्रोफाइल',
    navHistory: 'सलाह इतिहास',
    ctaLaunch: 'शुरू करें',
    ctaNewAdvisory: 'फसल निदान शुरू करें',
    quickDiagnose: 'त्वरित एआई निदान',
    severityLow: 'कम गंभीरता',
    severityModerate: 'मध्यम गंभीरता',
    severityHigh: 'उच्च गंभीरता',
    severityCritical: 'गंभीर चेतावनी',
    organicRemedies: 'जैविक एवं प्राकृतिक उपचार',
    chemicalTreatments: 'रासायनिक उपचार विकल्प',
    preventativeMeasures: 'रोकथाम एवं कृषि पद्धतियां',
    fertilizerPlan: 'उर्वरक एवं पोषण योजना',
    estimatedYieldImpact: 'अनुमानित उपज पर प्रभाव',
    confidence: 'एआई निदान सटीकता',
    weatherAdvisory: 'कृषि मौसम पूर्वानुमान',
    yieldForecast: 'उपज कैलकुलेटर',
    soilHealth: 'मृदा स्वास्थ्य सूचकांक',
    exportPdf: 'पीडीएफ डाउनलोड करें',
    printReport: 'रिपोर्ट प्रिंट करें',
    uploadLeafPhoto: 'पत्ती या फसल की फोटो अपलोड करें',
    dragDropPhoto: 'फोटो खींचें या अपलोड करने के लिए क्लिक करें (5MB तक)',
    symptomPlaceholder: 'पत्तियों का पीलापन, धब्बे, कीट या मुरझाने के लक्षण दर्ज करें...',
    selectFarm: 'खेत चुनें',
    selectCrop: 'फसल चुनें',
    primaryCrops: 'मुख्य फसलें',
    soilPh: 'मिट्टी का पीएच',
    totalArea: 'कुल क्षेत्रफल (एकड़)',
    irrigationType: 'सिंचाई का प्रकार',
    submitConsultation: 'जेमिनी एआई से जांचें',
    analyzingWithGemini: 'जेमिनी 2.5 फ्लैश द्वारा फसल विश्लेषण किया जा रहा है...',
    recentAdvisories: 'हाल की सलाह',
    myFarms: 'पंजीकृत खेत',
    noAdvisoriesYet: 'अभी तक कोई सलाह दर्ज नहीं की गई है। पहली जांच शुरू करें!',
    disclaimer: 'कृषि सलाह: सिफारिशें एआई मॉडल द्वारा तैयार की गई हैं। कीटनाशक प्रयोग में स्थानीय कृषि विभाग के दिशा-निर्देशों का पालन करें।'
  },
  fr: {
    appName: 'AgriAssist AI',
    tagline: 'Intelligence Agronomique et Santé des Cultures Propulsée par Google Gemini',
    navDashboard: 'Tableau de bord',
    navNewAdvisory: 'Nouvel Avis',
    navFarms: 'Profils Agricoles',
    navHistory: 'Historique',
    ctaLaunch: 'Lancer l\'application',
    ctaNewAdvisory: 'Diagnostiquer la Culture',
    quickDiagnose: 'Diagnostic IA Instantané',
    severityLow: 'Gravité Faible',
    severityModerate: 'Gravité Modérée',
    severityHigh: 'Gravité Élevée',
    severityCritical: 'Alerte Critique',
    organicRemedies: 'Traitements Biologiques et Organiques',
    chemicalTreatments: 'Traitements Chimiques Ciblés',
    preventativeMeasures: 'Mesures Préventives & Culturales',
    fertilizerPlan: 'Programme de Fertilisation',
    estimatedYieldImpact: 'Impact Estimé sur le Rendement',
    confidence: 'Précision du Diagnostic',
    weatherAdvisory: 'Prévisions Agro-Météorologiques',
    yieldForecast: 'Calculateur de Rendement',
    soilHealth: 'Indice de Santé du Sol',
    exportPdf: 'Exporter en PDF',
    printReport: 'Imprimer le Rapport',
    uploadLeafPhoto: 'Télécharger une photo de feuille',
    dragDropPhoto: 'Glissez une photo ou cliquez pour parcourir (JPEG, PNG, WebP jusqu\'à 5Mo)',
    symptomPlaceholder: 'Décrivez les taches foliaires, la présence de ravageurs, le flétrissement...',
    selectFarm: 'Sélectionner l\'Exploitation',
    selectCrop: 'Sélectionner la Culture',
    primaryCrops: 'Cultures Principales',
    soilPh: 'Niveau de pH du Sol',
    totalArea: 'Superficie Totale (Acres)',
    irrigationType: 'Système d\'Irrigation',
    submitConsultation: 'Analyser avec Gemini AI',
    analyzingWithGemini: 'Analyse agronomique en cours avec Gemini 2.5 Flash...',
    recentAdvisories: 'Consultations Récentes',
    myFarms: 'Exploitations Actives',
    noAdvisoriesYet: 'Aucune consultation enregistrée. Démarrez votre premier diagnostic !',
    disclaimer: 'Conseil Agronomique : Les recommandations sont générées par intelligence artificielle agronomique. Respectez toujours les dosages réglementaires locaux.'
  },
  sw: {
    appName: 'AgriAssist AI',
    tagline: 'Ushauri Mahiri wa Afya ya Mazao na Kilimo Unaowezeshwa na Google Gemini',
    navDashboard: 'Dashibodi',
    navNewAdvisory: 'Ushauri Mpya',
    navFarms: 'Mashamba Yangu',
    navHistory: 'Historia ya Ushauri',
    ctaLaunch: 'Anza Sasa',
    ctaNewAdvisory: 'Pima Afya ya Zao',
    quickDiagnose: 'Uchunguzi wa Papo Hapo wa AI',
    severityLow: 'Kiwango Kidogo',
    severityModerate: 'Kiwango cha Wastani',
    severityHigh: 'Kiwango Kikubwa',
    severityCritical: 'Tahadhari Kubwa',
    organicRemedies: 'Tiba za Kiasili na Kibiolojia',
    chemicalTreatments: 'Dawa za Kemikali Zilizopendekezwa',
    preventativeMeasures: 'Njia za Kuzuia za Kilimo',
    fertilizerPlan: 'Mpangilio wa Mbolea na Lishe',
    estimatedYieldImpact: 'Makadirio ya Athari kwa Mavuno',
    confidence: 'Uhakika wa Uchunguzi wa AI',
    weatherAdvisory: 'Utabiri wa Hali ya Hewa ya Kilimo',
    yieldForecast: 'Kikokotoo cha Mavuno',
    soilHealth: 'Ubora wa Udongo',
    exportPdf: 'Pakua Ripoti ya PDF',
    printReport: 'Chapisha Ripoti',
    uploadLeafPhoto: 'Pakia Picha ya Jani la Zao',
    dragDropPhoto: 'Buruta picha au bonyeza ili kupakia (hadi 5MB)',
    symptomPlaceholder: 'Eleza majani kuwa ya njano, madoa, wadudu, au kunyauka...',
    selectFarm: 'Chagua Shamba',
    selectCrop: 'Chagua Zao',
    primaryCrops: 'Mazao Makuu',
    soilPh: 'Kipimo cha pH cha Udongo',
    totalArea: 'Ukubwa wa Shamba (Ekari)',
    irrigationType: 'Aina ya Umwagiliaji',
    submitConsultation: 'Chunguza na Gemini AI',
    analyzingWithGemini: 'Inachunguza picha ya zao na kutoa ushauri kupitia Gemini 2.5 Flash...',
    recentAdvisories: 'Ushauri wa Hivi Karibuni',
    myFarms: 'Mashamba Yaliyosajiliwa',
    noAdvisoriesYet: 'Bado hakuna ushauri uliorekodiwa. Anza uchunguzi wako wa kwanza!',
    disclaimer: 'Ushauri wa Kitaalamu wa Kilimo: Mapendekezo yanatolewa na mifumo ya AI. Daima fuata maagizo rasmi ya matumizi ya viuatilifu.'
  }
};
