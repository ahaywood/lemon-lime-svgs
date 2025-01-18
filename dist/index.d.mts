#!/usr/bin/env node
interface IconBuilderConfig {
    inputDir?: string;
    outputDir?: string;
    typesDir?: string;
    spriteFilename?: string;
    typeFilename?: string;
    verbose?: boolean;
    generateReadme?: boolean;
}
declare function main(userConfig?: IconBuilderConfig): Promise<void>;
export type { IconBuilderConfig };
export default main;
