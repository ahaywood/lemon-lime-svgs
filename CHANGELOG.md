# 2.0.0

_released `2025-03-21`_

## Breaking Changes

- Moved configuration from `.env` file to `package.json` under the `lemonLimeSvgs` key
- Added migration script (`npx lemon-lime-svgs migrate`) to help users move from `.env` to `package.json`

## New Features

- Added component installation command (`npx lemon-lime-svgs component`) to install framework-specific Icon components
- Added pre-configuration for a React + Vite project
- Added support for React, Svelte, and Astro components
- Added option to install additional framework components when using Astro
- Added component installation option to the setup wizard
- Added overwrite protection when installing components to prevent accidental overwrites
- Added automatic configuration check that prompts users to run setup or migration if needed

## Improvements

- Updated TypeScript configuration to support JSX
- Improved error handling and user feedback
- Enhanced documentation with new features and usage examples

# 1.1.0

_released `2025-03-06`_

- Added option to append SVG configuration to existing .env files instead of only overwriting
- Improved setup wizard with more user-friendly options for handling existing .env files
- Changed npm script name from `build:icons` to `icons` for simplicity
- Added GitHub templates for pull requests and issues
- Added GitHub Action to automatically publish to npm on release

# 1.0.0

_released `2025-01-18`_

- initial release
