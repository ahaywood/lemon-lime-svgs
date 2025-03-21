#!/usr/bin/env node
import * as path from 'node:path';
import fsExtra from 'fs-extra';
import dotenv from 'dotenv';
import chalk from 'chalk';
/**
 * Migration script to move configuration from .env to package.json
 * This script will:
 * 1. Read the .env file
 * 2. Extract SVG-related configuration
 * 3. Add it to package.json under the lemonLimeSvgs key
 * 4. Optionally remove the SVG-related configuration from .env
 */
async function migrate() {
    console.log(chalk.yellow('🍋🍋 LEMON LIME SVGs - Migration Tool 🍋🍋\n'));
    console.log(chalk.cyan('This tool will migrate your configuration from .env to package.json\n'));
    const cwd = process.cwd();
    const envPath = path.join(cwd, '.env');
    const pkgPath = path.join(cwd, 'package.json');
    // Check if .env exists
    if (!await fsExtra.pathExists(envPath)) {
        console.log(chalk.red('❌ No .env file found. Nothing to migrate.'));
        return;
    }
    // Check if package.json exists
    if (!await fsExtra.pathExists(pkgPath)) {
        console.log(chalk.red('❌ No package.json file found. Cannot migrate.'));
        return;
    }
    // Read .env file
    const envContent = await fsExtra.readFile(envPath, 'utf8');
    const envConfig = dotenv.parse(envContent);
    // Extract SVG-related configuration
    const svgConfig = {
        inputDir: envConfig.SVG_INPUT_DIR,
        outputDir: envConfig.SVG_OUTPUT_DIR,
        typesDir: envConfig.SVG_TYPES_DIR,
        spriteFilename: envConfig.SVG_SPRITE_FILENAME,
        typeFilename: envConfig.SVG_TYPE_FILENAME,
        verbose: envConfig.SVG_VERBOSE === 'true',
        generateReadme: envConfig.SVG_GENERATE_README === 'true'
    };
    // Filter out undefined values
    const filteredConfig = {};
    for (const [key, value] of Object.entries(svgConfig)) {
        if (value !== undefined) {
            filteredConfig[key] = value;
        }
    }
    // If no SVG configuration found, exit
    if (Object.keys(filteredConfig).length === 0) {
        console.log(chalk.yellow('⚠️ No SVG configuration found in .env file. Nothing to migrate.'));
        return;
    }
    // Read package.json
    const pkgContent = await fsExtra.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgContent);
    // Check if lemonLimeSvgs already exists
    if (pkg.lemonLimeSvgs) {
        console.log(chalk.yellow('⚠️ lemonLimeSvgs configuration already exists in package.json.'));
        const answer = await promptYesNo('Do you want to overwrite it? (y/n): ');
        if (!answer) {
            console.log(chalk.red('❌ Migration cancelled.'));
            return;
        }
    }
    // Add lemonLimeSvgs configuration to package.json
    pkg.lemonLimeSvgs = filteredConfig;
    // Write updated package.json
    await fsExtra.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(chalk.green('✅ Successfully migrated configuration to package.json'));
    // Ask if user wants to remove SVG configuration from .env
    const removeFromEnv = await promptYesNo('Do you want to remove SVG configuration from .env? (y/n): ');
    if (removeFromEnv) {
        // Parse .env file line by line
        const lines = envContent.split('\n');
        const filteredLines = lines.filter(line => {
            // Keep lines that don't start with SVG_
            const trimmedLine = line.trim();
            return !trimmedLine.startsWith('SVG_') && trimmedLine !== '';
        });
        // If there are no lines left or only empty lines, ask if user wants to delete the file
        if (filteredLines.filter(line => line.trim() !== '').length === 0) {
            const deleteEnv = await promptYesNo('.env file will be empty. Delete it? (y/n): ');
            if (deleteEnv) {
                await fsExtra.remove(envPath);
                console.log(chalk.green('✅ Deleted empty .env file'));
            }
            else {
                // Write empty file
                await fsExtra.writeFile(envPath, '');
                console.log(chalk.green('✅ Cleared .env file'));
            }
        }
        else {
            // Write filtered content back to .env
            await fsExtra.writeFile(envPath, filteredLines.join('\n'));
            console.log(chalk.green('✅ Removed SVG configuration from .env file'));
        }
    }
    console.log(chalk.green('\n🎉 Migration complete!'));
    console.log(chalk.cyan('\nYour configuration is now stored in package.json under the lemonLimeSvgs key.'));
    console.log(chalk.cyan('You can now use the updated version of lemon-lime-svgs.'));
}
// Helper function to prompt for yes/no questions
async function promptYesNo(question) {
    const readline = (await import('node:readline/promises')).default;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const answer = await rl.question(chalk.cyan(question));
    rl.close();
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}
// Export the migrate function
export { migrate };
