[English](README.md) | [日本語](README.ja.md)

# create-macro

A CLI tool for quickly setting up Google Apps Script (GAS) projects.

## Installation

```bash
npm create macro
```

or

```bash
npx create-macro
```

## Usage

### Interactive Mode

```bash
npm create macro
```

Follow the prompts to configure your project:

1. Project name
2. Language (TypeScript / JavaScript)
3. Whether to auto-create a GAS project
4. Project type (standalone, sheets, docs, forms, slides, webapp)

### Non-Interactive Mode

```bash
npm create macro my-project -- --yes
```

Creates a project with default values:
- Language: TypeScript
- Create GAS project: Yes
- Project type: standalone

## Options

| Option | Short | Description |
|--------|-------|-------------|
| `--yes` | `-y` | Skip all prompts with default values |
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show version |

## Generated File Structure

```
my-project/
├── src/
│   ├── main.ts (or main.js)
│   └── appsscript.json
├── dist/           (generated after build)
├── .clasp.json
├── .gitignore
├── package.json
└── tsconfig.json   (TypeScript only)
```

## Workflow

```bash
# Create project
npm create macro my-project

# Change directory
cd my-project

# Build
npm run build

# Push to GAS
npm run push

# (Optional) Open in browser
npm run open
```

## Prerequisites

- Node.js >= 18
- Google account
- Google Apps Script API enabled (see below)

## Enabling GAS API

To auto-create GAS projects, you need to enable the Google Apps Script API:

1. Visit https://script.google.com/home/usersettings
2. Turn on "Google Apps Script API"

## License

MIT
