import path from 'path'
import fs from 'fs-extra'
import buildIcons from './index'

describe('Integration Tests', () => {
  const TEST_INPUT_DIR = path.join(__dirname, '../test-fixtures/input')
  const TEST_OUTPUT_DIR = path.join(__dirname, '../test-fixtures/output')

  beforeAll(async () => {
    // Create test directories and sample SVG files
    await fs.ensureDir(TEST_INPUT_DIR)
    await fs.writeFile(
      path.join(TEST_INPUT_DIR, 'test-icon.svg'),
      '<svg><path d="M0 0h24v24H0z"/></svg>'
    )
  })

  afterAll(async () => {
    // Clean up test directories
    await fs.remove(TEST_INPUT_DIR)
    await fs.remove(TEST_OUTPUT_DIR)
  })

  it('should process real SVG files', async () => {
    await buildIcons({
      inputDir: TEST_INPUT_DIR,
      outputDir: TEST_OUTPUT_DIR,
    })

    // Verify output files exist
    expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'sprite.svg'))).toBe(true)
    expect(fs.existsSync(path.join(TEST_OUTPUT_DIR, 'name.d.ts'))).toBe(true)
  })
})