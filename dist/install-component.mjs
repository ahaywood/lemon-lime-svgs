#!/usr/bin/env node
import * as path from 'node:path';
import fsExtra from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { templates } from './templates/index.mjs';
/**
 * Install icon component into the user's project
 * @param preselectedFramework Optional framework to use, skipping the framework selection prompt
 */
export async function installComponent(preselectedFramework) {
    console.log(chalk.yellow('🍋🍋 LEMON LIME SVGs - Component Installer 🍋🍋\n'));
    console.log(chalk.cyan('This tool will install an icon component into your project.\n'));
    const cwd = process.cwd();
    const pkgPath = path.join(cwd, 'package.json');
    // Check if package.json exists
    if (!await fsExtra.pathExists(pkgPath)) {
        console.log(chalk.red('❌ No package.json file found. Cannot determine project type.'));
        return;
    }
    // Read package.json to determine project type and load configuration
    const pkgContent = await fsExtra.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgContent);
    // Load lemonLimeSvgs configuration with defaults
    const baseDefaultConfig = {
        inputDir: 'other/svg-icons',
        outputDir: 'public/images/icons',
        typesDir: 'src/types',
        spriteFilename: 'sprite.svg',
        typeFilename: 'name.d.ts',
        verbose: true,
        generateReadme: false
    };
    const config = {
        ...baseDefaultConfig,
        ...(pkg.lemonLimeSvgs || {})
    };
    // Try to determine project type from dependencies
    let detectedFramework = null;
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    if (deps.react) {
        detectedFramework = 'react';
    }
    else if (deps.svelte) {
        detectedFramework = 'svelte';
    }
    else if (deps.astro) {
        detectedFramework = 'astro';
    }
    // Use preselected framework or ask user
    let framework;
    if (preselectedFramework) {
        framework = preselectedFramework;
        console.log(chalk.cyan(`Using ${framework} framework as specified`));
    }
    else {
        // Ask for framework if not detected or preselected
        const response = await inquirer.prompt([
            {
                type: 'list',
                name: 'framework',
                message: 'Which framework are you using?',
                default: detectedFramework || 'react',
                choices: [
                    { name: 'React', value: 'react' },
                    { name: 'Svelte', value: 'svelte' },
                    { name: 'Astro', value: 'astro' }
                ]
            }
        ]);
        framework = response.framework;
    }
    // If Astro, ask if they want additional components
    let additionalFramework = null;
    if (framework === 'astro') {
        const { useAdditional } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'useAdditional',
                message: 'Are you using a separate frontend framework with Astro?',
                default: false
            }
        ]);
        if (useAdditional) {
            const { additional } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'additional',
                    message: 'Which additional framework are you using?',
                    choices: [
                        { name: 'React', value: 'react' },
                        { name: 'Svelte', value: 'svelte' }
                    ]
                }
            ]);
            additionalFramework = additional;
        }
    }
    // Ask for component path
    const defaultPath = getDefaultComponentPath(framework);
    const { componentPath } = await inquirer.prompt([
        {
            type: 'input',
            name: 'componentPath',
            message: 'Where would you like to install the component?',
            default: defaultPath
        }
    ]);
    // Install main component
    await installComponentFile(framework, componentPath, config);
    // Install additional component if needed
    if (additionalFramework) {
        const additionalPath = getDefaultComponentPath(additionalFramework);
        const { additionalComponentPath } = await inquirer.prompt([
            {
                type: 'input',
                name: 'additionalComponentPath',
                message: `Where would you like to install the ${additionalFramework} component?`,
                default: additionalPath
            }
        ]);
        await installComponentFile(additionalFramework, additionalComponentPath, config);
    }
    console.log(chalk.green('\n🎉 Component installation complete!'));
    console.log(chalk.cyan('\nYou can now use the Icon component in your project.'));
}
/**
 * Get default component path based on framework
 */
function getDefaultComponentPath(framework) {
    switch (framework) {
        case 'react':
            return 'src/components/Icon.tsx';
        case 'svelte':
            return 'src/lib/components/Icon.svelte';
        case 'astro':
            return 'src/components/Icon.astro';
        default:
            return 'src/components/Icon';
    }
}
/**
 * Install component file
 */
async function installComponentFile(framework, componentPath, config) {
    try {
        // Get template content with dynamic import path for React
        const templateContent = getTemplateContent(framework, componentPath, config);
        // Ensure directory exists
        const componentDir = path.dirname(componentPath);
        await fsExtra.ensureDir(componentDir);
        // Check if file already exists
        if (await fsExtra.pathExists(componentPath)) {
            const { overwrite } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `Component file already exists at ${componentPath}. Overwrite?`,
                    default: false
                }
            ]);
            if (!overwrite) {
                console.log(chalk.yellow('⚠️ Installation skipped. File not overwritten.'));
                return;
            }
        }
        // Write template to component path
        await fsExtra.writeFile(componentPath, templateContent);
        console.log(chalk.green(`✅ Installed ${framework} component at ${componentPath}`));
    }
    catch (error) {
        console.error(`Error installing ${framework} component:`, error);
        throw error;
    }
}
/**
 * Get template content based on framework
 */
function getTemplateContent(framework, componentPath, config) {
    switch (framework) {
        case 'react':
            return getReactTemplate(componentPath, config);
        case 'svelte':
            return templates.svelte;
        case 'astro':
            return templates.astro;
        default:
            throw new Error(`Unknown framework: ${framework}`);
    }
}
/**
 * Generate React template with dynamic IconName import
 */
function getReactTemplate(componentPath, config) {
    // Calculate relative path from component to types file
    const componentDir = path.dirname(componentPath);
    const typesFile = path.join(config.typesDir, config.typeFilename);
    const relativePath = path.relative(componentDir, typesFile);
    // Convert to proper import path (remove .d.ts extension and normalize separators)
    const importPath = relativePath.replace(/\.d\.ts$/, '').replace(/\\/g, '/');
    return `import { IconName } from '${importPath}';

interface Props {
  size?: number;
  id: IconName;
  className?: string;
}

const Icon = ({ className, size = 24, id }: Props) => {
  return (
    <svg width={size} height={size} className={className}>
      <use href={\`/images/icons/sprite.svg#\${id}\`}></use>
    </svg>
  );
};

export default Icon;`;
}
// For ES modules, we can't use require.main === module
// Instead, we'll check if this file is being executed directly via a CLI command
// This is handled by the cli.mts file
