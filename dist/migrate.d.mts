#!/usr/bin/env node
/**
 * Migration script to move configuration from .env to package.json
 * This script will:
 * 1. Read the .env file
 * 2. Extract SVG-related configuration
 * 3. Add it to package.json under the lemonLimeSvgs key
 * 4. Optionally remove the SVG-related configuration from .env
 */
declare function migrate(): Promise<void>;
export { migrate };
