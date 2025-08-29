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
    // Read package.json to determine project type
    const pkgContent = await fsExtra.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgContent);
    // Try to determine project type from dependencies
    let detectedFramework = null;
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
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
    const mainComponentInstalled = await installComponentFile(framework, componentPath);
    // Install additional component if needed
    let additionalComponentInstalled = true;
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
        additionalComponentInstalled = await installComponentFile(additionalFramework, additionalComponentPath);
    }
    // Show success message only if at least one component was installed
    if (mainComponentInstalled || (additionalFramework && additionalComponentInstalled)) {
        console.log(chalk.green('\n🎉 Component installation complete!'));
        console.log(chalk.cyan('\nYou can now use the Icon component in your project.'));
    }
    else {
        console.log(chalk.yellow('\n⚠️ No components were installed.'));
    }
}
/**
 * Get default component path based on framework
 */
function getDefaultComponentPath(framework) {
    switch (framework) {
        case 'react':
            return 'src/app/components/Icon.tsx';
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
async function installComponentFile(framework, componentPath) {
    try {
        // Get template content
        const templateContent = getTemplateContent(framework);
        // Ensure directory exists
        const componentDir = path.dirname(componentPath);
        // Check if the directory path exists as a file
        if (await fsExtra.pathExists(componentDir)) {
            const stats = await fsExtra.stat(componentDir);
            if (stats.isFile()) {
                console.log(chalk.red(`❌ Cannot create directory at ${componentDir} because a file already exists there.`));
                console.log(chalk.yellow(`   Please remove the file or choose a different path.`));
                return false;
            }
        }
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
                return false;
            }
        }
        // Write template to component path
        await fsExtra.writeFile(componentPath, templateContent);
        console.log(chalk.green(`✅ Installed ${framework} component at ${componentPath}`));
        return true;
    }
    catch (error) {
        console.error(`Error installing ${framework} component:`, error);
        throw error;
    }
}
/**
 * Get template content based on framework
 */
function getTemplateContent(framework) {
    switch (framework) {
        case 'react':
            return templates.react;
        case 'svelte':
            return templates.svelte;
        case 'astro':
            return templates.astro;
        default:
            throw new Error(`Unknown framework: ${framework}`);
    }
}
// For ES modules, we can't use require.main === module
// Instead, we'll check if this file is being executed directly via a CLI command
// This is handled by the cli.mts file
