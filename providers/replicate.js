// providers/replicate.js
const BaseProvider = require('./base');

class ReplicateProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKeys.replicate;
    this.endpoint = config.endpoints.replicate;
  }

  async translate(items, targetLanguage, sourceLanguage = 'English') {
    const Replicate = require('replicate');
    const replicate = new Replicate({
      auth: this.apiKey,
    });

    // For batch translation, we'll join all items and then split the result
    const inputTexts = items.map(item => item.sourceText);
    const combinedText = inputTexts.join('\n---SEPARATOR---\n');
    
    const input = {
      text: combinedText,
      target_language: targetLanguage
    };

    try {
      const output = await replicate.run(this.endpoint.model, { input });
      
      // The output should be a string with translations separated by our separator
      let translatedText = output;
      if (typeof output === 'object' && output.output) {
        translatedText = output.output;
      } else if (typeof output === 'object' && output.text) {
        translatedText = output.text;
      } else if (Array.isArray(output)) {
        translatedText = output.join('');
      }

      // Split the result back into individual translations
      const translations = translatedText.split('\n---SEPARATOR---\n');
      
      // Ensure we have the right number of translations
      if (translations.length !== inputTexts.length) {
        // Fallback: translate each item individually
        return await this.translateIndividually(items, targetLanguage, replicate);
      }

      return translations.map(t => t.trim());
      
    } catch (error) {
      throw new Error(`Replicate translation failed: ${error.message}`);
    }
  }

  async translateIndividually(items, targetLanguage, replicate) {
    const translations = [];
    
    for (const item of items) {
      const input = {
        text: item.sourceText,
        target_language: targetLanguage
      };

      try {
        const output = await replicate.run(this.endpoint.model, { input });
        
        let translatedText = output;
        if (typeof output === 'object' && output.output) {
          translatedText = output.output;
        } else if (typeof output === 'object' && output.text) {
          translatedText = output.text;
        } else if (Array.isArray(output)) {
          translatedText = output.join('');
        }

        translations.push(translatedText.trim());
        
        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, this.config.requestDelay || 1000));
        
      } catch (error) {
        throw new Error(`Replicate translation failed for "${item.sourceText}": ${error.message}`);
      }
    }

    return translations;
  }
}

module.exports = ReplicateProvider;