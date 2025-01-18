#!/usr/bin/env node
import main, { setup } from './index.mjs';
import chalk from 'chalk';
const command = process.argv[2];
console.log(chalk.yellow('🍋🍋 SVG Sprite Builder 🍋🍋\n'));
switch (command) {
    case 'setup':
        setup().catch((error) => {
            console.error('Error during setup:', error);
            process.exit(1);
        });
        break;
    case undefined:
        main().catch((error) => {
            console.error('Error generating sprites:', error);
            process.exit(1);
        });
        break;
    default:
        console.error('Unknown command:', command);
        console.log('Available commands:');
        console.log(chalk.cyan('  lemon-lime-svgs      ') + chalk.gray('- Generate sprites'));
        console.log(chalk.cyan('  lemon-lime-svgs setup ') + chalk.gray('- Set up directory structure'));
        process.exit(1);
}
