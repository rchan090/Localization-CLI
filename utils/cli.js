// utils/cli.js
const inquirer = require('inquirer');
const chalk = require('chalk');
const cliProgress = require('cli-progress');

class CLIUtils {
  static async selectLanguage(languages, defaultLang = 'fr', isSource = false) {
    const choices = Object.entries(languages).map(([code, name]) => ({
      name: `${name} (${code})`,
      value: code,
      short: code
    }));

    const message = isSource ? '📖 Select source language:' : '🌍 Select target language:';
    
    const { selectedLanguage } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedLanguage',
        message: message,
        choices: choices,
        default: defaultLang,
        pageSize: 15
      }
    ]);

    return selectedLanguage;
  }

  static async selectBothLanguages(languages, defaultSource = 'en', defaultTarget = 'fr') {
    console.log(chalk.bold.blue('🔄 Translation Direction Setup'));
    console.log(chalk.yellow('Choose which language to translate FROM and TO\n'));
    
    const sourceLanguage = await this.selectLanguage(languages, defaultSource, true);
    const sourceName = languages[sourceLanguage];
    
    console.log(chalk.green(`✓ Source language: ${sourceName} (${sourceLanguage})\n`));
    
    const targetLanguage = await this.selectLanguage(languages, defaultTarget, false);
    const targetName = languages[targetLanguage];
    
    console.log(chalk.green(`✓ Target language: ${targetName} (${targetLanguage})\n`));
    
    const confirmed = await this.confirmAction(
      `Translate from ${chalk.white.bold(sourceName)} to ${chalk.white.bold(targetName)}?`,
      true
    );
    
    if (!confirmed) {
      return await this.selectBothLanguages(languages, defaultSource, defaultTarget);
    }
    
    return { sourceLanguage, targetLanguage, sourceName, targetName };
  }

  static async selectProvider(availableProviders) {
    const { selectedProvider } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedProvider',
        message: '🤖 Select AI provider:',
        choices: availableProviders.map(provider => ({
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
          value: provider
        }))
      }
    ]);

    return selectedProvider;
  }

  static async confirmAction(message, defaultValue = true) {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: message,
        default: defaultValue
      }
    ]);

    return confirmed;
  }

  static createProgressBar(total, format = null) {
    const defaultFormat = '🚀 Translating |{bar}| {percentage}% | {value}/{total} | ETA: {eta}s';
    
    const progressBar = new cliProgress.SingleBar({
      format: format || defaultFormat,
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true,
      clearOnComplete: false,
      stopOnComplete: true
    }, cliProgress.Presets.shades_classic);

    progressBar.start(total, 0);
    return progressBar;
  }

  static printHeader() {
    console.log(chalk.cyan(`
,--.                        ,--.,--.                 ,--.  ,--.                    ,-----.,--.   ,--. 
|  |    ,---.  ,---. ,--,--.|  |\`--',-----. ,--,--.,-'  '-.'\`--' ,---. ,--,--,     '  .--./|  |   |  | 
|  |   | .-. || .--'' ,-.  ||  |,--.'\`-.  / ' ,-.  |'-.  .-',--.| .-. ||      \\    |  |    |  |   |  | 
|  '--.' '-' '\\ '\`--.'\\ '-'  ||  ||  | /  '\`-.'\\ '-'  |  |  |  |  |' '-' '|  ||  |    '  '--'\\|  '--.|  | 
\`-----' \`---'  \`---' \`--\`--'\`--'\`--'\`-----' \`--\`--'  \`--'  \`--' \`---' \`--''--'     \`-----'\`-----'\`--' 
`));
    console.log(chalk.bold.white('                                  Localization CLI'));
    console.log(chalk.gray('━'.repeat(50)));
  }

  static printSuccess(message) {
    console.log(chalk.green(`✅ ${message}`));
  }

  static printError(message) {
    console.log(chalk.red(`❌ ${message}`));
  }

  static printWarning(message) {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }

  static printInfo(message) {
    console.log(chalk.blue(`ℹ️  ${message}`));
  }

  static async promptForFilePath() {
    console.log(chalk.yellow('\n📁 No xcstrings file path configured!'));
    console.log(chalk.gray('Please provide the path to your Localizable.xcstrings file.'));
    console.log(chalk.gray('You can find this by right-clicking your xcstrings file in Xcode and selecting "Show in Finder".\n'));
    
    const { filePath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: '📄 Enter the full path to your .xcstrings file:',
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'Please enter a valid file path';
          }
          if (!input.endsWith('.xcstrings')) {
            return 'File must have .xcstrings extension';
          }
          return true;
        }
      }
    ]);

    return filePath.trim();
  }

  static async promptForAppContext() {
    console.log(chalk.yellow('\n📱 Application Context Setup'));
    console.log(chalk.gray('Providing context about your app helps AI choose more accurate translations.'));
    console.log(chalk.gray('Examples: "travel booking app", "fitness tracker", "e-commerce platform", "social media app"\n'));
    
    const { appContext } = await inquirer.prompt([
      {
        type: 'input',
        name: 'appContext',
        message: '🎯 Describe your app (or press Enter to skip):',
        validate: (input) => {
          // Allow empty input (skip)
          return true;
        }
      }
    ]);

    const trimmed = appContext.trim();
    if (trimmed) {
      console.log(chalk.green(`✓ App context: ${trimmed}\n`));
    } else {
      console.log(chalk.gray('⏩ Skipping app context (generic translations will be used)\n'));
    }

    return trimmed;
  }

  static printStats(stats) {
    console.log(chalk.cyan('\n📊 Translation Statistics:'));
    console.log(chalk.gray('━'.repeat(30)));
    console.log(`📝 Total strings: ${chalk.white.bold(stats.total)}`);
    console.log(`✅ Successfully translated: ${chalk.green.bold(stats.success)}`);
    console.log(`❌ With errors: ${chalk.red.bold(stats.errors)}`);
    console.log(`⏱️  Total time: ${chalk.white.bold(stats.duration)}`);
    
    if (stats.provider) {
      console.log(`🤖 AI Provider: ${chalk.white.bold(stats.provider)}`);
    }
  }


}

module.exports = CLIUtils;