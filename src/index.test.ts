import { promises as fs } from 'fs'
import path from 'path'
import buildIcons, { IconBuilderConfig } from './index'

// Mock external dependencies
jest.mock('fs-extra', () => ({
  ensureDir: jest.fn(),
  writeFile: jest.fn(),
  readFile: jest.fn(),
}))

jest.mock('glob', () => ({
  glob: {
    sync: jest.fn(),
  },
}))

jest.mock('node-html-parser', () => ({
  parse: jest.fn(),
}))

describe('buildIcons', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should use default config when no options provided', async () => {
    const fsExtra = require('fs-extra')
    const { glob } = require('glob')

    // Mock glob to return empty array
    glob.sync.mockReturnValue([])

    await buildIcons()

    // Verify default input directory was used
    expect(glob.sync).toHaveBeenCalledWith('**/*.svg', {
      cwd: expect.stringContaining('svg-icons'),
    })
  })

  it('should use custom config when provided', async () => {
    const fsExtra = require('fs-extra')
    const { glob } = require('glob')

    const customConfig: IconBuilderConfig = {
      inputDir: 'custom/input',
      outputDir: 'custom/output',
      spriteFilename: 'custom-sprite.svg',
    }

    // Mock glob to return empty array
    glob.sync.mockReturnValue([])

    await buildIcons(customConfig)

    // Verify custom input directory was used
    expect(glob.sync).toHaveBeenCalledWith('**/*.svg', {
      cwd: expect.stringContaining('custom/input'),
    })
  })

  it('should process SVG files and generate sprite', async () => {
    const fsExtra = require('fs-extra')
    const { glob } = require('glob')
    const { parse } = require('node-html-parser')

    // Mock SVG files
    const mockSvgFiles = ['icon1.svg', 'icon2.svg']
    glob.sync.mockReturnValue(mockSvgFiles)

    // Mock SVG content
    fsExtra.readFile.mockImplementation((filepath: string) => {
      return Promise.resolve('<svg><path d="test"/></svg>')
    })

    // Mock HTML parser
    parse.mockImplementation((content: string) => ({
      querySelector: jest.fn().mockReturnValue({
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
      }),
      toString: () => content,
    }))

    await buildIcons({
      inputDir: 'test/input',
      outputDir: 'test/output',
    })

    // Verify sprite file was written
    expect(fsExtra.writeFile).toHaveBeenCalled()

    // Verify type definitions were generated
    expect(fsExtra.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('name.d.ts'),
      expect.any(String)
    )
  })

  it('should handle empty input directory', async () => {
    const { glob } = require('glob')
    const consoleSpy = jest.spyOn(console, 'log')

    // Mock empty directory
    glob.sync.mockReturnValue([])

    await buildIcons()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('No SVG files found')
    )
  })

  it('should respect verbose option', async () => {
    const { glob } = require('glob')
    const consoleSpy = jest.spyOn(console, 'log')

    // Mock some files
    glob.sync.mockReturnValue(['icon1.svg'])

    await buildIcons({ verbose: true })

    // Verify verbose logging occurred
    expect(consoleSpy).toHaveBeenCalled()
  })
})