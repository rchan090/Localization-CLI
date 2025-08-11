# Localization CLI

A command-line tool that auto-translates iOS localization files via multiple AI providers, supporting 70+ languages with flexible source language options.

## ✨ Features

- 🤖 **Multiple AI Providers**: Gemini, ChatGPT, Claude, DeepSeek, Perplexity, Grok
- 🌍 **70+ Languages**: French, German, Spanish, Italian, Portuguese, Turkish, Chinese, and many more
- 🎯 **Interactive CLI**: Beautiful progress bars, colorful output, and user-friendly prompts
- ⚙️ **Easy Configuration**: Environment variables and automatic file path detection
- 🎯 **Smart Context**: Application context helps AI choose more accurate translations
- 🔄 **Auto-Retry**: Failed chunks are automatically retried with configurable attempts
- 📊 **Real-time Progress**: Live translation progress with detailed statistics

https://github.com/user-attachments/assets/bfa71785-e31d-4e43-8177-fe1478653912

## 🚀 Quick Start

### Step 1: Create Localization File in Xcode

1. Open your iOS project in Xcode
2. Right-click on your project in the navigator
3. Select **"New File..."**
4. Choose **"iOS"** → **"Resource"** → **"String Catalog"**
5. Name it `Localizable` (Xcode will add the `.xcstrings` extension)
6. Add your base language strings to the file

### Step 2: Get File Path

1. After creating the Localizable.xcstrings file, click the "+" button in the bottom left.
2. Select the languages you want to add to your project.
3. Ensure you perform a build so that Xcode can properly detect and index the localized strings.

### Step 3: Get File Path

1. Right-click on your `Localizable.xcstrings` file in Xcode
2. Select **"Show in Finder"**
3. Right-click the file in Finder and select **"Get Info"**
4. Copy the full path from the "Where:" section
Example: /Users/enes/Documents/Projects/Example/Example

### Step 3: Setup Translation Bot

```bash
# Clone or download the CLI
git clone <repository-url>
cd localization-cli

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

### Step 4: Configure Environment

Edit your `.env` file:

```env
# Choose your AI provider
AI_PROVIDER=gemini

# Add your API key (get from provider's website)
GEMINI_API_KEY=your_api_key_here

# Set your file path (or leave empty to be prompted)
XCSTRINGS_FILE_PATH=/path/to/your/Localizable.xcstrings

# Set default languages
DEFAULT_SOURCE_LANGUAGE=en
DEFAULT_TARGET_LANGUAGE=de

# Set app context for better translations (optional)
APP_CONTEXT=travel booking app
```

### Step 5: Run Translation

```bash
# Interactive mode (will ask for languages)
node bot.js
```

## 🎯 Smart Context Feature

The CLI now supports **application context** to improve translation accuracy. When you provide context about your app (e.g., "travel booking app", "fitness tracker", "e-commerce platform"), the AI:

- Chooses more appropriate terminology for your domain
- Maintains consistent tone and style across translations
- Better understands technical terms and UI elements specific to your app type

**Setup:**
1. Set `APP_CONTEXT` in your `.env` file, or
2. Leave it empty to be prompted interactively when running the bot

**Examples:**
- `"travel booking app"` → Better translations for booking, hotels, flights
- `"fitness tracker"` → More accurate fitness and health terminology  
- `"e-commerce platform"` → Proper shopping and payment terms
- `"social media app"` → Appropriate social interaction language

## 🔄 Auto-Retry Feature

The CLI automatically retries failed translation chunks to improve success rates:

- **Default Behavior**: Each failed chunk is retried up to 3 times
- **Configurable**: Set `RETRY_COUNT` in your `.env` file (1-10 recommended)
- **Smart Delays**: Adds delays between retries to avoid rate limiting
- **Clear Logging**: Shows retry attempts and final failure reasons

**Configuration:**
```env
RETRY_COUNT=3                # Number of retry attempts (default: 3)
REQUEST_DELAY=1000          # Delay between retries in ms (default: 1000)
```

**What You'll See:**
```
⚠️  Chunk 9 failed (attempt 1/3): API rate limit exceeded
ℹ️  Retrying chunk 9 (attempt 2/3)
✅ Chunk 9 translation successful on retry
```

## 🔧 Troubleshooting

### Common Issues

**"File not found"**: Make sure your `.xcstrings` file path is correct and the file exists.

**"API key not found"**: Check that you've set the correct API key for your chosen provider in the `.env` file.

**"Translation failed"**: Try reducing the batch size or switching to a different AI provider.

**"inquirer.prompt is not a function"**: Run `npm install` to ensure dependencies are properly installed.

### Getting Help

1. Check your `.env` file configuration
2. Verify your API key is valid and has credits
3. Ensure your `.xcstrings` file is not corrupted
4. Try with a smaller batch size

## 🗺️ Roadmap

- [ ] **WebUI**: Browser-based interface for easier management
- [ ] **Multi-format Support**: Android XML, JSON, CSV, and other localization file formats beyond xcstrings

## 📝 License

MIT License - feel free to use and modify for your projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
