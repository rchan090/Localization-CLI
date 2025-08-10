// providers/base.js
class BaseProvider {
  constructor(config) {
    this.config = config;
  }

  async translate(items, targetLanguage) {
    throw new Error('translate method must be implemented by subclasses');
  }

  buildPrompt(items, targetLangName, sourceLangName = 'English') {
    const inputArray = items.map(i => i.sourceText);
    const inputJson = JSON.stringify(inputArray);
    const expectedCount = items.length;
    
    return [
      `You are a professional localization assistant. Translate each ${sourceLangName} UI string to ${targetLangName}, positionally aligned.`,
      'Rules:',
      '- Keep all placeholder tokens unchanged and in the exact position: %@, %1$@, %2$@, %lld, %@x, {name}, [count], etc.',
      '- Preserve punctuation, ellipses, newlines, quotes style, and spacing.',
      `- If the ${sourceLangName} string is ALL CAPS, return ${targetLangName} also in ALL CAPS.`,
      '- Maintain the same tone and formality level as the source.',
      '- For UI elements, keep translations concise and appropriate for interface constraints.',
      `Return ONLY a valid JSON array of strings with exactly ${expectedCount} items, in the same order as the input. No code fences, no labels, no extra text.`,
      '',
      'INPUT_JSON:',
      inputJson
    ].join('\n');
  }

  parseResponse(rawResponse, expectedCount) {
    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      // Try to extract JSON array if model added extra text accidentally
      const match = rawResponse.match(/\[[\s\S]*\]/);
      if (!match) throw new Error(`Model did not return JSON array.\nRaw:\n${rawResponse}`);
      parsed = JSON.parse(match[0]);
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Model did not return a JSON array.');
    }

    // Normalize to strings
    let values = parsed.map(v => (typeof v === 'string' ? v : String(v ?? '')));

    // If the model returned more items than requested, truncate to expected size
    if (values.length > expectedCount) {
      console.warn(`⚠️  Model returned extra items (${values.length}). Truncating to ${expectedCount}.`);
      values = values.slice(0, expectedCount);
    }

    // If fewer items than expected, fail fast so user can retry this chunk
    if (values.length < expectedCount) {
      throw new Error(
        `Model returned fewer items than expected. expected=${expectedCount} got=${values.length}`
      );
    }

    return values;
  }
}

module.exports = BaseProvider;