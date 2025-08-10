// providers/index.js
const GeminiProvider = require('./gemini');
const OpenAIProvider = require('./openai');
const ClaudeProvider = require('./claude');
const DeepSeekProvider = require('./deepseek');

function createProvider(config) {
  switch (config.aiProvider.toLowerCase()) {
    case 'gemini':
      return new GeminiProvider(config);
    case 'openai':
      return new OpenAIProvider(config);
    case 'claude':
      return new ClaudeProvider(config);
    case 'deepseek':
      return new DeepSeekProvider(config);
    default:
      throw new Error(`Unsupported AI provider: ${config.aiProvider}. Supported providers: gemini, openai, claude, deepseek`);
  }
}

module.exports = { createProvider };