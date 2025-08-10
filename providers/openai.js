// providers/openai.js
const BaseProvider = require('./base');

class OpenAIProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKeys.openai;
    this.endpoint = config.endpoints.openai;
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
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
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

module.exports = OpenAIProvider;