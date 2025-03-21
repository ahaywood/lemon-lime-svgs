# 🍋 Lemon Lime SVGs

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

## Usage in Next.js

1. Import the sprite in your layout or page:

```tsx

```

2. Use the Icon component:

## Commands

- `npx lemon-lime-svgs setup` - Interactive setup wizard
- `npx lemon-lime-svgs` - Generate sprite file
- `npm run icons` - Generate sprite (after setup)
- `npx lemon-lime-svgs migrate` - Migrate configuration from .env to package.json
- `npx lemon-lime-svgs component` - Install icon component for your framework

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

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
