#!/usr/bin/env node

import * as path from 'node:path'
import fsExtra from 'fs-extra'
import { glob } from 'glob'
import { parse } from 'node-html-parser'
import readline from 'node:readline/promises'
import chalk from 'chalk'
import { installComponent } from './install-component.mjs'
interface IconBuilderConfig {
  // Input/Output paths
  inputDir?: string
  outputDir?: string
  typesDir?: string
  // Optional customization
  spriteFilename?: string
  typeFilename?: string
  verbose?: boolean
  generateReadme?: boolean
}

// Default configuration that will be used if no package.json config is found
const baseDefaultConfig: Required<IconBuilderConfig> = {
  inputDir: 'other/svg-icons',
  outputDir: 'public/images/icons',
  typesDir: 'src/types',
  spriteFilename: 'sprite.svg',
  typeFilename: 'name.d.ts',
  verbose: true,
  generateReadme: false
}

// This will be populated with values from package.json if available
let defaultConfig: Required<IconBuilderConfig> = { ...baseDefaultConfig }

// Try to load config from package.json
try {
  const pkgPath = path.join(process.cwd(), 'package.json')
  const pkg = JSON.parse(fsExtra.readFileSync(pkgPath, 'utf8')) as PackageJson
  if (pkg.lemonLimeSvgs) {
    defaultConfig = {
      ...baseDefaultConfig,
      ...pkg.lemonLimeSvgs
    }
  }
} catch (error) {
  // If package.json can't be read, use the base defaults
  console.log(chalk.yellow('⚠️ Could not read package.json, using default configuration'))
}

// Check if .env file exists and contains SVG configuration
let hasEnvConfig = false
try {
  const envPath = path.join(process.cwd(), '.env')
  if (fsExtra.existsSync(envPath)) {
    const envContent = fsExtra.readFileSync(envPath, 'utf8')
    hasEnvConfig = envContent.includes('SVG_INPUT_DIR') ||
      envContent.includes('SVG_OUTPUT_DIR') ||
      envContent.includes('SVG_TYPES_DIR')
  }
} catch (error) {
  // Ignore errors when checking .env
}

interface PackageJson {
  name?: string
  version?: string
  scripts?: Record<string, string>
  lemonLimeSvgs?: {
    inputDir?: string
    outputDir?: string
    typesDir?: string
    spriteFilename?: string
    typeFilename?: string
    verbose?: boolean
    generateReadme?: boolean
  }
  [key: string]: unknown
}

interface FrameworkConfig {
  inputDir: string
  outputDir: string
  typesDir: string
  typeFilename: string
}

const frameworkConfigs: Record<string, FrameworkConfig> = {
  'next-pages': {
    inputDir: './other/svg-icons',
    outputDir: './public/images/icons',
    typesDir: './src/types/icons',
    typeFilename: 'icons.d.ts'
  },
  'next-app': {
    inputDir: './src/other/svg-icons',
    outputDir: './public/images/icons',
    typesDir: './src/types/icons',
    typeFilename: 'icons.d.ts'
  },
  remix: {
    inputDir: './other/svg-icons',
    outputDir: './public/images/icons',
    typesDir: './app/types/icons',
    typeFilename: 'icons.d.ts'
  },
  sveltekit: {
    inputDir: './other/svg-icons',
    outputDir: './static/images/icons',
    typesDir: './src',
    typeFilename: 'icons.d.ts'
  },
  astro: {
    inputDir: './other/svg-icons',
    outputDir: './public/images/icons',
    typesDir: './src',
    typeFilename: 'icons.d.ts'
  },
  'react-vite': {
    inputDir: './other/svg-icons',
    outputDir: './public/images/icons',
    typesDir: './src/types',
    typeFilename: 'icons.d.ts'
  }
}

// Check if configuration exists, otherwise prompt for setup
async function checkConfiguration(): Promise<boolean> {
  const pkgPath = path.join(process.cwd(), 'package.json')
  let hasPackageJsonConfig = false
  let hasEnvConfig = false

  try {
    // Check if package.json has lemonLimeSvgs configuration
    if (fsExtra.existsSync(pkgPath)) {
      const pkg = JSON.parse(fsExtra.readFileSync(pkgPath, 'utf8')) as PackageJson
      hasPackageJsonConfig = !!pkg.lemonLimeSvgs && Object.keys(pkg.lemonLimeSvgs).length > 0
    }

    // Check if .env file exists and contains SVG configuration
    const envPath = path.join(process.cwd(), '.env')
    if (fsExtra.existsSync(envPath)) {
      const envContent = fsExtra.readFileSync(envPath, 'utf8')
      hasEnvConfig = envContent.includes('SVG_INPUT_DIR') ||
        envContent.includes('SVG_OUTPUT_DIR') ||
        envContent.includes('SVG_TYPES_DIR')
    }

    // If no configuration found, prompt for setup
    if (!hasPackageJsonConfig && !hasEnvConfig) {
      console.log(chalk.yellow('\n⚠️ No configuration found.'))
      console.log(chalk.cyan('Please run the setup wizard to configure Lemon Lime SVGs:'))
      console.log(chalk.white('  npx lemon-lime-svgs setup'))
      return false
    }

    // If only .env configuration found, recommend migration
    if (!hasPackageJsonConfig && hasEnvConfig) {
      console.log(chalk.yellow('\n⚠️ Found configuration in .env file but not in package.json.'))
      console.log(chalk.cyan('We recommend migrating your configuration to package.json:'))
      console.log(chalk.white('  npx lemon-lime-svgs migrate'))
      console.log(chalk.gray('\nContinuing with .env configuration for now...'))
    }

    return true
  } catch (error) {
    console.error('Error checking configuration:', error)
    return false
  }
}

async function main(userConfig: IconBuilderConfig = {}) {
  // Check if configuration exists
  const configExists = await checkConfiguration()
  if (!configExists) {
    return
  }

  const config = { ...defaultConfig, ...userConfig }
  const cwd = process.cwd()

  const inputDir = path.join(cwd, config.inputDir)
  console.log('🔍 Looking for SVGs in:', inputDir)

  const inputDirRelative = path.relative(cwd, inputDir)
  const outputDir = path.join(cwd, config.outputDir)
  const typesDir = path.join(cwd, config.typesDir)
  await fsExtra.ensureDir(inputDir)
  await fsExtra.ensureDir(outputDir)
  await fsExtra.ensureDir(typesDir)

  const files = glob
    .sync('**/*.svg', {
      cwd: inputDir,
    })
    .sort((a, b) => a.localeCompare(b))

  console.log('Found SVG files:', files)

  const logVerbose = config.verbose ? console.log : () => { }

  if (files.length === 0) {
    console.log(`No SVG files found in ${inputDirRelative}`)
  } else {
    await generateIconFiles(files, {
      inputDir,
      outputDir,
      typesDir,
      spriteFilename: config.spriteFilename,
      typeFilename: config.typeFilename,
      generateReadme: config.generateReadme,
      logVerbose,
    })
  }

  async function generateIconFiles(
    files: string[],
    options: {
      inputDir: string
      outputDir: string
      typesDir: string
      spriteFilename: string
      typeFilename: string
      generateReadme: boolean
      logVerbose: (message?: any, ...args: any[]) => void
    }
  ) {
    const { inputDir, outputDir, typesDir, spriteFilename, typeFilename, generateReadme, logVerbose } = options
    const spriteFilepath = path.join(outputDir, spriteFilename)
    const typeOutputFilepath = path.join(typesDir, typeFilename)
    const currentSprite = await fsExtra
      .readFile(spriteFilepath, 'utf8')
      .catch(() => '')
    const currentTypes = await fsExtra
      .readFile(typeOutputFilepath, 'utf8')
      .catch(() => '')

    const iconNames = files.map((file) => iconName(file))

    const spriteUpToDate = iconNames.every((name) =>
      currentSprite.includes(`id=${name}`)
    )
    const typesUpToDate = iconNames.every((name) =>
      currentTypes.includes(`"${name}"`)
    )

    if (spriteUpToDate && typesUpToDate) {
      logVerbose(`Icons are up to date`)
      return
    }

    logVerbose(`Generating sprite for ${inputDirRelative}`)

    const spriteChanged = await generateSvgSprite({
      files,
      inputDir,
      outputPath: spriteFilepath,
    })

    for (const file of files) {
      logVerbose('✅', file)
    }
    logVerbose(`Saved to ${path.relative(cwd, spriteFilepath)}`)

    const stringifiedIconNames = iconNames.map((name) => JSON.stringify(name))

    const typeOutputContent = `// This file is generated by npm run icons

export type IconName =
\t| ${stringifiedIconNames.join('\n\t| ')};
`
    const typesChanged = await writeIfChanged(
      typeOutputFilepath,
      typeOutputContent
    )

    logVerbose(`Manifest saved to ${path.relative(cwd, typeOutputFilepath)}`)

    const readmeChanged = generateReadme && await writeIfChanged(
      path.join(outputDir, 'README.md'),
      `# Icons

This directory contains SVG icons that are used by the app.

Everything in this directory is generated by \`npm run icons\`.
`
    )

    if (spriteChanged || typesChanged || readmeChanged) {
      console.log(`Generated ${files.length} icons`)
    }
  }

  function iconName(file: string) {
    return file.replace(/\.svg$/, '')
  }

  /**
   * Creates a single SVG file that contains all the icons
   */
  async function generateSvgSprite({
    files,
    inputDir,
    outputPath,
  }: {
    files: string[]
    inputDir: string
    outputPath: string
  }) {
    // Each SVG becomes a symbol and we wrap them all in a single SVG
    const symbols = await Promise.all(
      files.map(async (file) => {
        const input = await fsExtra.readFile(path.join(inputDir, file), 'utf8')
        const root = parse(input)

        const svg = root.querySelector('svg')
        if (!svg) throw new Error('No SVG element found')

        svg.tagName = 'symbol'
        svg.setAttribute('id', iconName(file))
        svg.removeAttribute('xmlns')
        svg.removeAttribute('xmlns:xlink')
        svg.removeAttribute('version')
        svg.removeAttribute('width')
        svg.removeAttribute('height')
        svg.removeAttribute('fill')

        // loop over paths and remove the `fill` setAttribute
        // this allows us to set the svg fill with css
        const paths = svg.querySelectorAll('path')
        for (const path of paths) {
          path.removeAttribute('fill')
        }

        return svg.toString().trim()
      })
    )

    const output = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<!-- This file is generated by npm run icons -->`,
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">`,
      `<defs>`, // for semantics: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs
      ...symbols,
      `</defs>`,
      `</svg>`,
      '', // trailing newline
    ].join('\n')

    return writeIfChanged(outputPath, output)
  }

  async function writeIfChanged(filepath: string, newContent: string) {
    const currentContent = await fsExtra
      .readFile(filepath, 'utf8')
      .catch(() => '')
    if (currentContent === newContent) return false
    await fsExtra.writeFile(filepath, newContent, 'utf8')
    return true
  }
}

async function setup() {
  const cwd = process.cwd()
  
  // Check if --y flag is provided
  const useDefaults = process.argv.includes('--y') || process.argv.includes('-y')
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log(chalk.yellow('🍋 Setting up SVG Sprite Builder configuration...\n'))

  // Ask for framework first
  let frameworkChoice = '0' // Default to custom configuration
  
  if (!useDefaults) {
    console.log(chalk.cyan('Available frameworks:'))
    console.log(chalk.gray('  1. Next.js (Pages Router)'))
    console.log(chalk.gray('  2. Next.js (App Router)'))
    console.log(chalk.gray('  3. Remix'))
    console.log(chalk.gray('  4. SvelteKit'))
    console.log(chalk.gray('  5. Astro'))
    console.log(chalk.gray('  6. React + Vite'))
    console.log(chalk.gray('  0. Custom configuration'))
    console.log('')

    frameworkChoice = await rl.question(chalk.cyan('🍋 Select your framework (0-6): '))
    console.log('')
  } else {
    console.log(chalk.cyan('🍋 Using default configuration (custom)'))
  }

  // Create a copy of the base config
  let configDefaults = { ...defaultConfig }

  switch (frameworkChoice) {
    case '1':
      configDefaults = { ...configDefaults, ...frameworkConfigs['next-pages'] }
      break
    case '2':
      configDefaults = { ...configDefaults, ...frameworkConfigs['next-app'] }
      break
    case '3':
      configDefaults = { ...configDefaults, ...frameworkConfigs['remix'] }
      break
    case '4':
      configDefaults = { ...configDefaults, ...frameworkConfigs['sveltekit'] }
      break
    case '5':
      configDefaults = { ...configDefaults, ...frameworkConfigs['astro'] }
      break
    case '6':
      configDefaults = { ...configDefaults, ...frameworkConfigs['react-vite'] }
      break
    case '0':
    default:
      // Use existing defaults
      break
  }

  // Rest of the setup using the selected configDefaults...
  let config;
  
  if (useDefaults) {
    // Use defaults without prompting
    config = {
      inputDir: configDefaults.inputDir,
      outputDir: configDefaults.outputDir,
      typesDir: configDefaults.typesDir,
      spriteFilename: configDefaults.spriteFilename,
      typeFilename: configDefaults.typeFilename,
      verbose: configDefaults.verbose,
      generateReadme: configDefaults.generateReadme
    };
    
    console.log(chalk.cyan('🍋 Using default configuration values:'));
    console.log(chalk.gray(`  Input directory: ${config.inputDir}`));
    console.log(chalk.gray(`  Output directory: ${config.outputDir}`));
    console.log(chalk.gray(`  Types directory: ${config.typesDir}`));
    console.log(chalk.gray(`  Sprite filename: ${config.spriteFilename}`));
    console.log(chalk.gray(`  Type filename: ${config.typeFilename}`));
    console.log(chalk.gray(`  Verbose logging: ${config.verbose ? 'Yes' : 'No'}`));
    console.log(chalk.gray(`  Generate README: ${config.generateReadme ? 'Yes' : 'No'}`));
  } else {
    // Interactive prompts
    config = {
      inputDir: await rl.question(chalk.cyan(`🍋 Input directory for SVG files ${chalk.gray(`(default: ${configDefaults.inputDir})`)}: `)) || configDefaults.inputDir,
      outputDir: await rl.question(chalk.cyan(`🍋 Output directory for sprite ${chalk.gray(`(default: ${configDefaults.outputDir})`)}: `)) || configDefaults.outputDir,
      typesDir: await rl.question(chalk.cyan(`🍋 Directory for TypeScript types ${chalk.gray(`(default: ${configDefaults.typesDir})`)}: `)) || configDefaults.typesDir,
      spriteFilename: await rl.question(chalk.cyan(`🍋 Sprite filename ${chalk.gray(`(default: ${configDefaults.spriteFilename})`)}: `)) || configDefaults.spriteFilename,
      typeFilename: await rl.question(chalk.cyan(`🍋 Type definition filename ${chalk.gray(`(default: ${configDefaults.typeFilename})`)}: `)) || configDefaults.typeFilename,
      verbose: (await rl.question(chalk.cyan(`🍋 Enable verbose logging? ${chalk.gray('(y/N)')}: `))).toLowerCase() === 'y',
      generateReadme: (await rl.question(chalk.cyan(`🍋 Generate README? ${chalk.gray('(Y/n)')}: `))).toLowerCase() !== 'n'
    }
  }

  // Handle package.json
  const pkgPath = path.join(cwd, 'package.json')
  let pkg: PackageJson = {}

  try {
    pkg = JSON.parse(await fsExtra.readFile(pkgPath, 'utf8')) as PackageJson
  } catch (error) {
    console.log('⚠️  No package.json found')
    process.exit(1)
  }

  pkg.scripts = pkg.scripts || {}
  let shouldUpdatePackageJson = !pkg.scripts['icons']

  if (pkg.scripts['icons'] && !useDefaults) {
    const overwrite = await rl.question(chalk.red('😱  icons script already exists. Overwrite? ') + chalk.gray('(y/N): '))
    shouldUpdatePackageJson = overwrite.toLowerCase() === 'y'
  } else if (pkg.scripts['icons'] && useDefaults) {
    // When using --y flag, don't overwrite existing script
    shouldUpdatePackageJson = false
    console.log(chalk.yellow('⚠️  icons script already exists. Keeping existing script.'))
  }

  // Check if package.json already has lemonLimeSvgs config
  let shouldUpdateConfig = true

  if (pkg.lemonLimeSvgs && !useDefaults) {
    const configAction = await rl.question(chalk.yellow('🍋 lemonLimeSvgs configuration already exists in package.json. What would you like to do? ') +
      chalk.gray('\n  1. Overwrite the configuration') +
      chalk.gray('\n  2. Cancel setup') +
      chalk.gray('\n Choose (1-2): '))

    if (configAction === '1') {
      shouldUpdateConfig = true
    } else {
      // Cancel setup
      shouldUpdateConfig = false
    }
  } else if (pkg.lemonLimeSvgs && useDefaults) {
    // When using --y flag, don't overwrite existing config
    shouldUpdateConfig = false
    console.log(chalk.yellow('⚠️  lemonLimeSvgs configuration already exists in package.json. Keeping existing configuration.'))
  }

  // Now we can safely close readline
  rl.close()

  // Create directories
  await fsExtra.ensureDir(path.join(cwd, config.inputDir))
  await fsExtra.ensureDir(path.join(cwd, config.outputDir))
  await fsExtra.ensureDir(path.join(cwd, config.typesDir))

  // Update package.json if needed
  if (shouldUpdatePackageJson) {
    pkg.scripts['icons'] = 'lemon-lime-svgs'
    console.log(chalk.green('✅ Added icons script to package.json'))
  } else {
    console.log('')
    console.log('Skipping script addition')
    console.log('')
  }

  // Update package.json config if needed
  if (shouldUpdateConfig) {
    // Add lemonLimeSvgs configuration to package.json
    pkg.lemonLimeSvgs = {
      inputDir: config.inputDir,
      outputDir: config.outputDir,
      typesDir: config.typesDir,
      spriteFilename: config.spriteFilename,
      typeFilename: config.typeFilename,
      verbose: config.verbose,
      generateReadme: config.generateReadme
    }

    // Write updated package.json
    await fsExtra.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
    console.log(chalk.green('\n✅ Added lemonLimeSvgs configuration to package.json'))
    console.log(chalk.yellow('📝 Configuration Preview:'))
    console.log(chalk.gray(JSON.stringify(pkg.lemonLimeSvgs, null, 2)))
  } else {
    console.log('')
    console.log('❌ Setup cancelled')
    console.log('')
    process.exit(0)
  }

  console.log(chalk.green('✅ Created required directories'))

  // Handle component installation
  let shouldInstallComponent = true; // Default to YES
  
  if (useDefaults) {
    // When using --y flag, install component by default
    console.log(chalk.cyan('🍋 Installing Icon component with default settings.'))
  } else {
    // Ask if they want to install the Icon component
    const rlComponent = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const installComponentAnswer = await rlComponent.question(chalk.cyan(`🍋 Would you like to install an Icon component for your project? ${chalk.gray('(Y/n)')}: `))
    rlComponent.close()
    
    // Default to 'yes' if empty response, otherwise check for explicit 'no'
    shouldInstallComponent = installComponentAnswer.trim() === '' || installComponentAnswer.toLowerCase() !== 'n';
  }

  if (shouldInstallComponent) {
    // Determine the framework from the earlier choice
    let detectedFramework: 'react' | 'svelte' | 'astro' | null = null

    switch (frameworkChoice) {
      case '1': // Next.js (Pages Router)
      case '2': // Next.js (App Router)
      case '6': // React + Vite
        detectedFramework = 'react'
        break
      case '3': // Remix
        detectedFramework = 'react'
        break
      case '4': // SvelteKit
        detectedFramework = 'svelte'
        break
      case '5': // Astro
        detectedFramework = 'astro'
        break
    }

    if (detectedFramework) {
      console.log(chalk.cyan(`\n🍋 Installing ${detectedFramework} Icon component...`))
      await installComponent(detectedFramework)
    } else {
      console.log(chalk.cyan(`\n🍋 Installing Icon component...`))
      await installComponent()
    }
  }

  console.log(chalk.green(`🎉 Setup complete! You can now add SVG files to ${chalk.cyan(config.inputDir)}/\n`))
}

export type { IconBuilderConfig }
export default main

export { setup }