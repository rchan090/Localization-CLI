// bot.js
// Advanced AI Translation Bot v2.0
// Usage: node bot.js [lang_code] [--provider=<provider>] [--batch-size=<size>]

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { createProvider } = require('./providers');

const CLIUtils = require('./utils/cli');

// Parse command line arguments
const args = process.argv.slice(2);
const langArg = args.find(arg => !arg.startsWith('--'));
const providerArg = args.find(arg => arg.startsWith('--provider='))?.split('=')[1];
const batchSizeArg = args.find(arg => arg.startsWith('--batch-size='))?.split('=')[1];

// Override config with command line arguments
if (providerArg) config.aiProvider = providerArg;
if (batchSizeArg) config.batchSize = parseInt(batchSizeArg);

let TARGET_LANG_CODE = langArg || config.defaultTargetLanguage;
let TARGET_LANG_NAME = config.languages[TARGET_LANG_CODE];
let SOURCE_LANG_CODE = config.defaultSourceLanguage;
let SOURCE_LANG_NAME = config.languages[SOURCE_LANG_CODE];

// Utility functions
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

async function translateBatch(provider, batch, targetLanguage, sourceLanguage) {
  return await provider.translate(batch, targetLanguage, sourceLanguage);
}

(async function main() {
  try {
    CLIUtils.printHeader();

    // Interactive language selection if not provided
    if (!TARGET_LANG_NAME || !langArg) {
      CLIUtils.printInfo('Setting up translation languages...');
      const languages = await CLIUtils.selectBothLanguages(
        config.languages, 
        config.defaultSourceLanguage, 
        config.defaultTargetLanguage
      );
      
      SOURCE_LANG_CODE = languages.sourceLanguage;
      SOURCE_LANG_NAME = languages.sourceName;
      TARGET_LANG_CODE = languages.targetLanguage;
      TARGET_LANG_NAME = languages.targetName;
    }

    // Prompt for app context if not configured
    if (!config.appContext) {
      CLIUtils.printInfo('Setting up application context...');
      config.appContext = await CLIUtils.promptForAppContext();
    }

    // Create AI provider
    const provider = createProvider(config);
    CLIUtils.printInfo(`Using AI provider: ${config.aiProvider.toUpperCase()}`);
    if (config.appContext) {
      CLIUtils.printInfo(`App context: ${config.appContext}`);
    }

    // Check if file path is configured
    if (!config.filePath || !fs.existsSync(config.filePath)) {
      if (!config.filePath) {
        CLIUtils.printWarning('XCSTRINGS_FILE_PATH not set in .env file');
      } else {
        CLIUtils.printWarning(`File not found: ${config.filePath}`);
      }
      config.filePath = await CLIUtils.promptForFilePath();
      
      // Verify the file exists
      if (!fs.existsSync(config.filePath)) {
        CLIUtils.printError(`File not found: ${config.filePath}`);
        process.exit(1);
      }
    }

    // Read and parse the xcstrings file
    CLIUtils.printInfo(`Reading file: ${config.filePath}`);
    const file = fs.readFileSync(config.filePath, 'utf-8');
    let json;
    
    try {
      json = JSON.parse(file);
    } catch (e) {
      CLIUtils.printError(`Failed to parse Localizable.xcstrings as JSON: ${e.message}`);
      process.exit(1);
    }

    if (!json || typeof json !== 'object' || !json.strings) {
      CLIUtils.printError('Invalid xcstrings structure: missing "strings" root object.');
      process.exit(1);
    }

    const strings = json.strings;
    const items = [];

    // Collect all translatable strings
    Object.keys(strings).forEach(key => {
      const entry = strings[key] || {};
      const localizations = entry.localizations || {};
      const sourceText = localizations[SOURCE_LANG_CODE]?.stringUnit?.value;

      if (!sourceText || typeof sourceText !== 'string' || sourceText.trim() === '') return;
      items.push({ key, sourceText });
    });

    if (items.length === 0) {
      CLIUtils.printWarning(`No ${SOURCE_LANG_NAME} source strings found. Nothing to translate.`);
      return;
    }

    // Confirmation before proceeding
    console.log(`\n📊 Found ${items.length} strings to translate from ${SOURCE_LANG_NAME} to ${TARGET_LANG_NAME}`);
    console.log(`📖 Source: ${SOURCE_LANG_NAME} (${SOURCE_LANG_CODE})`);
    console.log(`🌍 Target: ${TARGET_LANG_NAME} (${TARGET_LANG_CODE})`);
    console.log(`🤖 AI Provider: ${config.aiProvider.toUpperCase()}`);
    console.log(`📦 Batch size: ${config.batchSize}`);
    
    const confirmed = await CLIUtils.confirmAction(
      '\n⚠️  Existing translations will be overwritten. Continue?',
      true
    );

    if (!confirmed) {
      CLIUtils.printInfo('Translation cancelled by user.');
      return;
    }

    // Start translation process
    const startTime = Date.now();
    const chunks = chunkArray(items, config.batchSize);
    const progressBar = CLIUtils.createProgressBar(items.length);
    
    let processed = 0;
    let stats = {
      total: items.length,
      success: 0,
      errors: 0,
      provider: config.aiProvider.toUpperCase()
    };

    async function processChunkWithRetry(chunk, chunkIndex) {
      const maxRetries = config.retryCount || 3;
      let lastError = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 1) {
            CLIUtils.printInfo(`Retrying chunk ${chunkIndex + 1} (attempt ${attempt}/${maxRetries})`);
            // Add delay before retry
            await new Promise(resolve => setTimeout(resolve, config.requestDelay || 1000));
          }

          const translations = await translateBatch(provider, chunk, TARGET_LANG_NAME, SOURCE_LANG_NAME);

          translations.forEach((trValue, idx) => {
            const { key, sourceText } = chunk[idx];
            
            // Update statistics
            stats.success++;

            // Update the strings object
            if (!strings[key].localizations) strings[key].localizations = {};
            strings[key].localizations[TARGET_LANG_CODE] = {
              stringUnit: {
                state: 'translated',
                value: trValue
              }
            };
          });

          return true; // Success
        } catch (error) {
          lastError = error;
          if (attempt < maxRetries) {
            CLIUtils.printWarning(`Chunk ${chunkIndex + 1} failed (attempt ${attempt}/${maxRetries}): ${error.message}`);
          }
        }
      }

      // All retries failed
      CLIUtils.printError(`Failed to translate chunk ${chunkIndex + 1} after ${maxRetries} attempts: ${lastError.message}`);
      chunk.forEach(() => {
        stats.errors++;
      });
      return false; // Failed
    }

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      await processChunkWithRetry(chunk, i);
      
      processed += chunk.length;
      progressBar.update(processed);
    }

    progressBar.stop();

    // Calculate duration
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1) + 's';
    stats.duration = duration;



    // Save the updated file
    fs.writeFileSync(config.filePath, JSON.stringify(json, null, 2), 'utf-8');
    
    // Print final results
    CLIUtils.printSuccess(`\nTranslation completed! Updated file: ${config.filePath}`);
    CLIUtils.printStats(stats);

  } catch (error) {
    CLIUtils.printError(`Translation failed: ${error.message}`);
    process.exit(1);
  }
})();