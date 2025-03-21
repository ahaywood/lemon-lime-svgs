#!/usr/bin/env node
import { migrate } from './migrate.mjs';
migrate().catch((error) => {
    console.error('Error during migration:', error);
    process.exit(1);
});
