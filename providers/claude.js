// providers/claude.js
const BaseProvider = require('./base');

class ClaudeProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKeys.claude;
    this.endpoint = config.endpoints.claude;
  }

  async translate(items, targetLanguage, sourceLanguage = 'English') {
    const prompt = this.buildPrompt(items, targetLanguage, sourceLanguage);
    const rawResponse = await this.makeRequest(prompt);
    return this.parseResponse(rawResponse, items.length);
  }

  async makeRequest(prompt) {
    const axios = require('axios');
    
    const response = await axios.post(
      `${this.endpoint.baseURL}/messages`,
      {
        model: this.endpoint.model,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return response.data.content[0].text;
  }
}

module.exports = ClaudeProvider;