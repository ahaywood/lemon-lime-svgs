#!/usr/bin/env node
/**
 * Install icon component into the user's project
 * @param preselectedFramework Optional framework to use, skipping the framework selection prompt
 */
export declare function installComponent(preselectedFramework?: 'react' | 'svelte' | 'astro'): Promise<void>;
