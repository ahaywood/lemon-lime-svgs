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
npm run build:icons
```

## Configuration

The setup wizard will help you configure:

- Input directory for SVG files
- Output directory for the sprite
- TypeScript types directory
- Sprite and type definition filenames
- Verbose logging
- README generation

All settings are stored in your project's `.env` file and can be modified manually:

```
SVG_INPUT_DIR="./other/svg-icons"
SVG_OUTPUT_DIR="./public/images/icons"
SVG_TYPES_DIR="./src/types"
SVG_SPRITE_FILENAME="sprite.svg"
SVG_TYPE_FILENAME="name.d.ts"
SVG_VERBOSE=false
SVG_GENERATE_README=true
```

## Usage in Next.js

1. Import the sprite in your layout or page:

```tsx

```

2. Use the Icon component:

## Commands

- `npx lemon-lime-svgs setup` - Interactive setup wizard
- `npx lemon-lime-svgs` - Generate sprite file
- `npm run build:icons` - Generate sprite (after setup)

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[GNU Lesser General Public License (LGPL)](./LICENSE.md)

## Author

Amy (Haywood) Dutton - [@ahaywood](https://github.com/ahaywood)

## Framework-Specific Configurations

Lemon Lime SVGs provides optimized default configurations for popular frameworks:

### Next.js (Pages Router)

```env
SVG_INPUT_DIR="./other/svg-icons"
SVG_OUTPUT_DIR="./public/images/icons"
SVG_TYPES_DIR="./src/types/icons"
SVG_TYPE_FILENAME="icons.d.ts"
```

### Next.js (App Router)

```env
SVG_INPUT_DIR="./src/other/svg-icons"
SVG_OUTPUT_DIR="./public/images/icons"
SVG_TYPES_DIR="./src/types/icons"
SVG_TYPE_FILENAME="icons.d.ts"
```

### Remix

```env
SVG_INPUT_DIR="./other/svg-icons"
SVG_OUTPUT_DIR="./public/images/icons"
SVG_TYPES_DIR="./app/types/icons"
SVG_TYPE_FILENAME="icons.d.ts"
```

### SvelteKit

```env
SVG_INPUT_DIR="./other/svg-icons"
SVG_OUTPUT_DIR="./static/images/icons"
SVG_TYPES_DIR="./src"
SVG_TYPE_FILENAME="icons.d.ts"
```

### Astro

```env
SVG_INPUT_DIR="./other/svg-icons"
SVG_OUTPUT_DIR="./public/images/icons"
SVG_TYPES_DIR="./src"
SVG_TYPE_FILENAME="icons.d.ts"
```
