// providers/index.js
const GeminiProvider = require('./gemini');
const OpenAIProvider = require('./openai');
const ClaudeProvider = require('./claude');
const DeepSeekProvider = require('./deepseek');
const ReplicateProvider = require('./replicate');

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
    case 'replicate':
      return new ReplicateProvider(config);
    default:
      throw new Error(`Unsupported AI provider: ${config.aiProvider}. Supported providers: gemini, openai, claude, deepseek, replicate`);
  }
}

module.exports = { createProvider };