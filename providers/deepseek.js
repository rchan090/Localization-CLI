// providers/deepseek.js
const BaseProvider = require('./base');

class DeepSeekProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKeys.deepseek;
    this.endpoint = config.endpoints.deepseek;
  }

  async translate(items, targetLanguage, sourceLanguage = 'English') {
    const prompt = this.buildPrompt(items, targetLanguage, sourceLanguage);
    const rawResponse = await this.makeRequest(prompt);
    return this.parseResponse(rawResponse, items.length);
  }

  async makeRequest(prompt) {
    const axios = require('axios');
    
    const response = await axios.post(
      `${this.endpoint.baseURL}/chat/completions`,
      {
        model: this.endpoint.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional translation assistant specialized in software localization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }
}

module.exports = DeepSeekProvider;