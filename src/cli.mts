#!/usr/bin/env node
import main, { setup } from './index.mjs'
import { migrate } from './migrate.mjs'
import { installComponent } from './install-component.mjs'
import chalk from 'chalk'

const command = process.argv[2]

console.log(chalk.yellow('🍋🍋 LEMON LIME SVGs 🍋🍋\n'))

switch (command) {
  case 'setup':
    setup().catch((error) => {
      console.error('Error during setup:', error)
      process.exit(1)
    })
    break
    
  case 'migrate':
    migrate().catch((error) => {
      console.error('Error during migration:', error)
      process.exit(1)
    })
    break
    
  case 'component':
    installComponent().catch((error) => {
      console.error('Error during component installation:', error)
      process.exit(1)
    })
    break

  case undefined:
    main().catch((error) => {
      console.error('Error generating sprites:', error)
      process.exit(1)
    })
    break

  default:
    console.error('Unknown command:', command)
    console.log('Available commands:')
    console.log(chalk.cyan('  lemon-lime-svgs      ') + chalk.gray('- Generate sprites'))
    console.log(chalk.cyan('  lemon-lime-svgs setup ') + chalk.gray('- Set up directory structure'))
    console.log(chalk.cyan('  lemon-lime-svgs migrate ') + chalk.gray('- Migrate config from .env to package.json'))
    console.log(chalk.cyan('  lemon-lime-svgs component ') + chalk.gray('- Install icon component'))
    process.exit(1)
}