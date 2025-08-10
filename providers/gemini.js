// providers/gemini.js
const https = require('https');
const BaseProvider = require('./base');

class GeminiProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKeys.gemini;
    this.endpoint = config.endpoints.gemini;
  }

  async translate(items, targetLanguage, sourceLanguage = 'English') {
    const prompt = this.buildPrompt(items, targetLanguage, sourceLanguage);
    const rawResponse = await this.makeRequest(prompt);
    return this.parseResponse(rawResponse, items.length);
  }

  makeRequest(prompt) {
    const body = JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    });

    const options = {
      hostname: this.endpoint.host,
      path: this.endpoint.path,
      method: 'POST',
      headers: {
        'x-goog-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const text =
              parsed?.candidates?.[0]?.content?.parts?.[0]?.text ??
              parsed?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') ??
              '';
            resolve(text);
          } catch (e) {
            reject(new Error(`Gemini response parse error: ${e.message}\nRaw: ${data}`));
          }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}

module.exports = GeminiProvider;