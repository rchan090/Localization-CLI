// config.js
require('dotenv').config();

const config = {
  // AI Provider Settings
  aiProvider: process.env.AI_PROVIDER || 'gemini',
  
  // API Keys
  apiKeys: {
    gemini: process.env.GEMINI_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    claude: process.env.CLAUDE_API_KEY,
    deepseek: process.env.DEEPSEEK_API_KEY,
    replicate: process.env.REPLICATE_API_TOKEN
  },
  
  // File Settings
  filePath: process.env.XCSTRINGS_FILE_PATH || '/Users/enes/Documents/Projects/Tourdio/Tourdio/Localizable.xcstrings',
  
  // Translation Settings
  batchSize: parseInt(process.env.BATCH_SIZE) || 50,
  defaultTargetLanguage: process.env.DEFAULT_TARGET_LANGUAGE || 'fr',
  defaultSourceLanguage: process.env.DEFAULT_SOURCE_LANGUAGE || 'en',
  
  // Quality Control
  // (Basic validation features removed for simplicity)
  
  // Advanced Settings
  verboseLogging: process.env.VERBOSE_LOGGING === 'true',
  retryCount: parseInt(process.env.RETRY_COUNT) || 3,
  requestDelay: parseInt(process.env.REQUEST_DELAY) || 1000,
  
  // API Endpoints
  endpoints: {
    gemini: {
      host: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-2.5-flash:generateContent'
    },
    openai: {
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-4'
    },
    claude: {
      baseURL: 'https://api.anthropic.com/v1',
      model: 'claude-3-sonnet-20240229'
    },
    deepseek: {
      baseURL: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat'
    },
    replicate: {
      model: 'lucataco/seed-x-ppo:bd6fdc731bd97a7dc3ea84285479567a3d40165d851bc7251122defd30372e8c'
    }
  },
  
  // Language Mappings
  languages: {
    // Major European Languages
    en: 'English',
    tr: 'Turkish',
    fr: 'French', 
    de: 'German',
    es: 'Spanish',
    it: 'Italian',
    pt: 'Portuguese',
    'pt-BR': 'Portuguese (Brazil)',
    ru: 'Russian',
    nl: 'Dutch',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    fi: 'Finnish',
    pl: 'Polish',
    cs: 'Czech',
    sk: 'Slovak',
    ro: 'Romanian',
    hu: 'Hungarian',
    el: 'Greek',
    bg: 'Bulgarian',
    hr: 'Croatian',
    sr: 'Serbian',
    sl: 'Slovenian',
    lv: 'Latvian',
    lt: 'Lithuanian',
    et: 'Estonian',
    mt: 'Maltese',
    is: 'Icelandic',
    
    // Middle East & Africa
    ar: 'Arabic',
    he: 'Hebrew',
    fa: 'Persian/Farsi',
    ur: 'Urdu',
    sw: 'Swahili',
    am: 'Amharic',
    
    // Asian Languages
    zh: 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
    ja: 'Japanese',
    ko: 'Korean',
    hi: 'Hindi',
    bn: 'Bengali',
    th: 'Thai',
    vi: 'Vietnamese',
    id: 'Indonesian',
    ms: 'Malay',
    tl: 'Filipino/Tagalog',
    km: 'Khmer',
    lo: 'Lao',
    my: 'Myanmar/Burmese',
    ne: 'Nepali',
    si: 'Sinhala',
    ta: 'Tamil',
    te: 'Telugu',
    ml: 'Malayalam',
    kn: 'Kannada',
    gu: 'Gujarati',
    pa: 'Punjabi',
    mr: 'Marathi',
    or: 'Odia',
    as: 'Assamese',
    
    // Other Languages
    uk: 'Ukrainian',
    be: 'Belarusian',
    ka: 'Georgian',
    hy: 'Armenian',
    az: 'Azerbaijani',
    kk: 'Kazakh',
    ky: 'Kyrgyz',
    uz: 'Uzbek',
    tj: 'Tajik',
    mn: 'Mongolian',
    
    // Americas
    'es-MX': 'Spanish (Mexico)',
    'es-AR': 'Spanish (Argentina)',
    'fr-CA': 'French (Canada)',
    qu: 'Quechua',
    gn: 'Guarani',
    
    // Other Constructed/Regional
    eu: 'Basque',
    ca: 'Catalan',
    gl: 'Galician',
    cy: 'Welsh',
    ga: 'Irish',
    gd: 'Scottish Gaelic',
    br: 'Breton',
    eo: 'Esperanto'
  }
};

// Validation
if (!config.apiKeys[config.aiProvider]) {
  console.error(`❌ API key not found for provider: ${config.aiProvider}`);
  console.error(`Please set ${config.aiProvider.toUpperCase()}_API_KEY in your .env file`);
  process.exit(1);
}

module.exports = config;