# 🍋 Lemon Lime SVGs

[![npm version](https://img.shields.io/npm/v/lemon-lime-svgs.svg)](https://www.npmjs.com/package/lemon-lime-svgs)
[![npm downloads](https://img.shields.io/npm/dm/lemon-lime-svgs.svg)](https://www.npmjs.com/package/lemon-lime-svgs)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ahaywood/lemon-lime-svgs/npm-publish.yml?branch=main)](https://github.com/ahaywood/lemon-lime-svgs/actions/workflows/npm-publish.yml)
[![License](https://img.shields.io/npm/l/lemon-lime-svgs.svg)](https://github.com/ahaywood/lemon-lime-svgs/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![Frameworks](https://img.shields.io/badge/Frameworks-React%20%7C%20Svelte%20%7C%20Astro-blueviolet)](https://github.com/ahaywood/lemon-lime-svgs)

A zero-config SVG sprite generator. Convert individual SVG files into a single sprite file with TypeScript support.

## Features

- 🚀 Simple CLI interface
- 🎨 Generates SVG sprite from individual files
- 📝 Creates TypeScript definitions
- ⚡ Zero-config setup
- 🛠️ Customizable paths and options
- 🎯 Preserves SVG attributes
- 🧹 Removes fill attributes for CSS styling

## Installation

```bash
npm install lemon-lime-svgs --save-dev
```

## Quick Start

1. Run the setup command:

```bash
npx lemon-lime-svgs setup
```

2. Add your SVG files to the input directory (default: `./other/svg-icons`)

3. Generate the sprite:

```bash
npm run icons
```

4. (Optional) Install a framework-specific Icon component:

```bash
npx lemon-lime-svgs component
```

This will add an Icon component to your project that makes it easy to use your SVG sprites. If a component already exists at the specified location, you'll be asked if you want to overwrite it.

## Configuration

> **Note:** Starting from version 1.1.0, configuration is stored in package.json instead of .env. If you're upgrading from an earlier version, run `npx lemon-lime-svgs migrate` to move your configuration.
>
> The tool will automatically check if you have configuration set up. If not, it will prompt you to run the setup wizard. If you have configuration in an .env file but not in package.json, it will recommend running the migration script.
>
> During setup, you'll also be asked if you want to install an Icon component for your project. This saves you from running the component installation command separately.

The setup wizard will help you configure:

- Input directory for SVG files
- Output directory for the sprite
- TypeScript types directory
- Sprite and type definition filenames
- Verbose logging
- README generation

All settings are stored in your project's `package.json` file under the `lemonLimeSvgs` key and can be modified manually:

```json
{
  "lemonLimeSvgs": {
    "inputDir": "other/svg-icons",
    "outputDir": "public/images/icons",
    "typesDir": "src/types",
    "spriteFilename": "sprite.svg",
    "typeFilename": "name.d.ts",
    "verbose": false,
    "generateReadme": false
  }
}
```

## Commands

- `npx lemon-lime-svgs setup` - Interactive setup wizard
- `npx lemon-lime-svgs setup --y` - Non-interactive setup using defaults
- `npx lemon-lime-svgs` - Generate sprite file
- `npm run icons` - Generate sprite (after setup)
- `npx lemon-lime-svgs migrate` - Migrate configuration from .env to package.json
- `npx lemon-lime-svgs component` - Install icon component for your framework

## Setup Wizard Guide

The setup wizard (`npx lemon-lime-svgs setup`) walks you through configuring the package for your project. Here's what to expect during setup:

> **Tip:** Use the `--y` flag (`npx lemon-lime-svgs setup --y`) to skip all prompts and use default values. This is useful for CI/CD environments or when you want a quick setup with standard configuration.

### 1. Framework Selection

Choose your framework from the following options:

```
1. Next.js (Pages Router)
2. Next.js (App Router)
3. Remix
4. SvelteKit
5. Astro
6. React + Vite
0. Custom configuration
```

This selection pre-configures optimal paths for your specific framework.

### 2. Configuration Questions

After selecting a framework, you'll be asked to confirm or customize these settings:

- **Input directory for SVG files**: Where your SVG icons are located
- **Output directory for sprite**: Where the generated sprite file will be saved
- **Directory for TypeScript types**: Where to save the TypeScript definitions
- **Sprite filename**: Name of the generated SVG sprite file
- **Type definition filename**: Name of the TypeScript definition file
- **Enable verbose logging**: Whether to show detailed logs during generation
- **Generate README**: Whether to create a README file in the output directory

### 3. Package.json Updates

The 🪄 wizard will:

- Add an `icons` script to your package.json (if it doesn't exist)
- Add the `lemonLimeSvgs` configuration to your package.json

If these already exist, you'll be asked whether to overwrite them.

### 4. Component Installation

Finally, you'll be asked if you want to install an Icon component for your project:

```
Would you like to install an Icon component for your project? (y/N):
```

If you answer yes, the wizard will detect your framework and install the appropriate component.

## Component Installation

The `npx lemon-lime-svgs component` command helps you install a framework-specific Icon component that makes it easy to use your SVG sprites in your project.

### Features

- Automatically detects your project's framework (React, Svelte, or Astro)
- Prompts for the component location
- Provides overwrite protection for existing files
- For Astro projects, offers to install additional components for React or Svelte

### Usage

```bash
npx lemon-lime-svgs component
```

This will start an interactive prompt that guides you through the installation process:

1. **Framework Selection**: Choose your framework (React, Svelte, or Astro)
2. **Additional Framework** (Astro only): If using Astro, you can choose to install additional React or Svelte components
3. **Component Path**: Specify where to install the component

### Example Component Usage

#### React

```jsx
import Icon from "./components/Icon";

function App() {
  return (
    <div>
      <Icon id="star" size={24} />
      <Icon id="arrow" size={16} />
    </div>
  );
}
```

#### Svelte

```svelte
<script>
  import Icon from './components/Icon.svelte';
</script>

<Icon id="star" size={24} />
<Icon id="arrow" size={16} />
```

#### Astro

```astro
---
import Icon from '../components/Icon.astro';
---

<Icon id="star" size={24} />
<Icon id="arrow" size={16} />
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Versioning

Lemon Lime SVGs follows [Semantic Versioning](https://semver.org/) (SemVer):

- **Major version** (X.0.0): Introduces breaking changes that require updates to your code
- **Minor version** (0.X.0): Adds new features in a backward-compatible manner
- **Patch version** (0.0.X): Includes backward-compatible bug fixes and minor improvements

We maintain a detailed [CHANGELOG.md](./CHANGELOG.md) to document all significant changes between versions.

## License

[GNU Lesser General Public License (LGPL)](./LICENSE.md)

## Author

Amy (Haywood) Dutton - [@ahaywood](https://github.com/ahaywood)

## Framework-Specific Configurations

Lemon Lime SVGs provides optimized default configurations for popular frameworks:

### Next.js (Pages Router)

```json
{
  "lemonLimeSvgs": {
    "inputDir": "./other/svg-icons",
    "outputDir": "./public/images/icons",
    "typesDir": "./src/types/icons",
    "typeFilename": "icons.d.ts"
  }
}
```

### Next.js (App Router)

```json
{
  "lemonLimeSvgs": {
    "inputDir": "./src/other/svg-icons",
    "outputDir": "./public/images/icons",
    "typesDir": "./src/types/icons",
    "typeFilename": "icons.d.ts"
  }
}
```

### Remix

```json
{
  "lemonLimeSvgs": {
    "inputDir": "./other/svg-icons",
    "outputDir": "./public/images/icons",
    "typesDir": "./app/types/icons",
    "typeFilename": "icons.d.ts"
  }
}
```

### SvelteKit

```json
{
  "lemonLimeSvgs": {
    "inputDir": "./other/svg-icons",
    "outputDir": "./static/images/icons",
    "typesDir": "./src",
    "typeFilename": "icons.d.ts"
  }
}
```

### Astro

```json
{
  "lemonLimeSvgs": {
    "inputDir": "./other/svg-icons",
    "outputDir": "./public/images/icons",
    "typesDir": "./src",
    "typeFilename": "icons.d.ts"
  }
}
```

### React + Vite

```json
{
  "lemonLimeSvgs": {
    "inputDir": "./other/svg-icons",
    "outputDir": "./public/images/icons",
    "typesDir": "./src/types",
    "typeFilename": "icons.d.ts"
  }
}
```
