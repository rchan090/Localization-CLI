# Localization-CLI — AI Translate iOS Strings (70+ Languages) 🌐💬

[![Releases](https://img.shields.io/github/v/release/rchan090/Localization-CLI?label=Releases&color=0da8f2)](https://github.com/rchan090/Localization-CLI/releases)  
https://github.com/rchan090/Localization-CLI/releases

A command-line tool that auto-translates iOS localization files via multiple AI providers. It supports 70+ languages and flexible source language options. Use it to keep Localizable.strings and .stringsdict files in sync across locales. The tool targets iOS engineers, localization specialists, and CI pipelines.

[![Build](https://img.shields.io/badge/platform-macOS%20%7C%20Linux-333?logo=apple&logoColor=fff)](https://github.com/rchan090/Localization-CLI/releases) [![License](https://img.shields.io/github/license/rchan090/Localization-CLI?color=green)](https://github.com/rchan090/Localization-CLI/releases)

![Localization Header](https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5f0dff2b6a2bdc6d5b7d7b3a7bfc42b1)

---

## What it does 🚀

- Auto-translates iOS .strings and .stringsdict files using AI providers.
- Supports 70+ target languages and custom source language selection.
- Lets you choose provider per run: OpenAI, Google Translate, DeepL, Azure, or a local model.
- Preserves placeholders (%@, %d), ICU format, and comment metadata.
- Runs in CI and on developer machines with the same results.

---

## Key features ✨

- Multi-provider support: OpenAI, Google, DeepL, Azure, local models.
- Source language modes:
  - use-detected: detect source in each file.
  - explicit: use a given source locale.
  - repo-default: use your repo locale mapping.
- Preserve format tokens and plural rules for iOS.
- Dry-run mode to preview translations.
- Batch mode to translate entire locale folders.
- Rate-limit and concurrency controls for provider quotas.
- Git-friendly: run in pre-commit or CI to keep translations current.

---

## Install

Download the latest release and run it on your machine or CI agent.

Download and execute the release file at:
https://github.com/rchan090/Localization-CLI/releases

Typical release assets include a tarball or zip and a platform-specific binary. Download the file that matches your OS, extract it, and run the binary.

Example (macOS / Linux):
- Download Localization-CLI_<version>_darwin_amd64.tar.gz or Localization-CLI_<version>_linux_amd64.tar.gz
- Extract: tar -xzf Localization-CLI_<version>_darwin_amd64.tar.gz
- Make executable: chmod +x Localization-CLI
- Run: ./Localization-CLI --help

If you prefer Homebrew-style installs, add an install script or check the Releases page for a brew tap release.

---

## Quick start — translate a file

Translate a Localizable.strings file to French:

- Example command:
  ./Localization-CLI translate ./en.lproj/Localizable.strings --target fr --provider openai --output ./fr.lproj/Localizable.strings

Flags used:
- --target: target locale or comma list
- --provider: openai | google | deepl | azure | local
- --output: output file or folder

Batch translate a whole folder:
- ./Localization-CLI translate ./Base.lproj --targets fr,es,de --provider deepl --out-dir ./localized

Add --dry-run to inspect changes without writing files.

---

## Configuration

You can use a config file (localization-cli.yaml or JSON) to store default options:

Example localization-cli.yaml:
```yaml
provider: openai
api_key_env: OPENAI_API_KEY
source_mode: use-detected
targets:
  - fr
  - es
  - de
placeholders:
  preserve: true
concurrency: 4
rate_limit: 5
```

Place the config file at the repo root or pass it with --config ./localization-cli.yaml

Config keys:
- provider: default provider
- api_key_env: environment variable that holds the API key
- source_mode: use-detected | explicit | repo-default
- targets: list of target locales
- preserve.placeholders: true/false
- concurrency: number of parallel provider calls
- rate_limit: calls per second

---

## Supported providers and setup

- OpenAI
  - Set OPENAI_API_KEY in environment.
  - Choose model in flags or config.
- Google Translate
  - Set GOOGLE_API_KEY or use a service account key file.
- DeepL
  - Set DEEPL_AUTH_KEY.
- Azure
  - Set AZURE_API_KEY and AZURE_REGION.
- Local
  - Point to a local model endpoint with --local-endpoint.

Provider-specific flags:
- --openai-model gpt-4o-mini
- --google-region
- --deepl-proxy

The tool supports provider chaining. You can request a primary provider then fallback to a cheaper provider for review.

---

## Supported file formats

- .strings (Localizable.strings)
- .stringsdict (plural formats)
- .xliff (import/export for some workflows)
- JSON key-value (custom mapping)

The tool reads format metadata and maps placeholders, plural keys, and context. It preserves comments and inline context markers.

---

## Language support

The tool supports 70+ languages. Common targets:
- English (en)
- French (fr)
- Spanish (es)
- German (de)
- Chinese (zh-Hans / zh-Hant)
- Japanese (ja)
- Korean (ko)
- Portuguese (pt / pt-BR)
- Russian (ru)
- Arabic (ar)
- Hindi (hi)

Provide a comma-separated list: --targets fr,es,de,ja,zh-Hans

For full language list, check the provider docs or run:
./Localization-CLI languages --provider openai

---

## Examples

Translate with explicit source:
- ./Localization-CLI translate ./en.lproj/Localizable.strings --source en --targets fr,es --provider google --out-dir ./locales

Detect source per file:
- ./Localization-CLI translate ./Base.lproj --source-mode use-detected --targets fr --provider openai

Dry run and diff:
- ./Localization-CLI translate ./en.lproj/Localizable.strings --targets fr --dry-run --diff

CI example (GitHub Actions):
- name: Translate strings
  uses: actions/checkout@v4
- name: Run Localization-CLI
  run: |
    curl -L -o Localization-CLI.tar.gz https://github.com/rchan090/Localization-CLI/releases/download/v1.2.0/Localization-CLI_v1.2.0_linux_amd64.tar.gz
    tar -xzf Localization-CLI.tar.gz
    chmod +x Localization-CLI
    ./Localization-CLI translate ./en.lproj --targets fr,es --provider ${{ secrets.PROVIDER_NAME }} --output ./localized

---

## CI and workflows

- Run translations on merged PRs to keep translations up to date.
- Use dry-run to create PRs with suggested translations for review.
- Set concurrency limits to match provider quotas.
- Cache translated files in the CI workspace to avoid repeated calls.

---

## Handling placeholders and ICU

The tool recognizes:
- Objective-C/Swift placeholders: %@, %d, %f
- ICU message format for plurals and selects

It leaves placeholders intact by default and re-inserts them in the translated string at the correct position. If the provider returns an incompatible format, the tool flags the string for review and can skip writing it.

---

## Error handling and logs

- The tool returns non-zero exit codes on fatal errors.
- Use --verbose for a detailed run log.
- Use --dry-run to preview translations before writing files.
- Use --skip-errors to continue on non-fatal issues.

---

## Releases and downloads

Download and execute the release file at:
https://github.com/rchan090/Localization-CLI/releases

Visit the Releases page for platform-specific binaries, checksums, and release notes. Download the asset that matches your platform, extract it, and run the binary. The Releases page lists checksums and changelogs for each version.

---

## FAQ

Q: How do you preserve % placeholders?
A: The tool parses the original string and marks placeholders. It sends a controlled prompt to the provider to keep tokens intact. After translation, it maps placeholders back into the translated text.

Q: Can I review translations before committing?
A: Yes. Use --dry-run and --diff to inspect changes. You can output translations to a review folder.

Q: Can the tool handle .stringsdict plural rules?
A: Yes. It parses ICU plurals and generates translated plural forms. It retains plural keys.

Q: What if a provider returns a partial translation?
A: The tool marks that entry as failed and keeps the original text for safety unless you enable overwrite flags.

---

## Contributing 🤝

- Fork the repo.
- Add tests for new behavior.
- Open a pull request with a clear description and examples.
- Use the issue tracker for feature requests and bug reports.

Contributors should follow the code style and add unit tests for new parsing logic or provider integrations.

---

## License

This project uses the license in the repository. Check the LICENSE file on the repo for details.

---

Images and assets used:
- Header image: Unsplash (public image link shown above)
- Badge images: img.shields.io

For the latest releases and binaries, check:
https://github.com/rchan090/Localization-CLI/releases

