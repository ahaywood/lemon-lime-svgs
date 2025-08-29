import { readFileSync } from 'fs'
import { join } from 'path'

describe('Default Configuration Values', () => {
  test('should have correct default values in baseDefaultConfig', () => {
    // Read the source file to check the actual default values
    const indexPath = join(__dirname, 'index.mts')
    const content = readFileSync(indexPath, 'utf8')

    // Check that verbose is set to true
    expect(content).toMatch(/verbose:\s*true/)
    
    // Check that generateReadme is set to false
    expect(content).toMatch(/generateReadme:\s*false/)
    
    // Check that shouldInstallComponent defaults to true
    expect(content).toMatch(/let shouldInstallComponent = true/)
    
    // Check that the prompt shows (Y/n) indicating Yes is default
    expect(content).toMatch(/\(Y\/n\)/)
  })

  test('should have correct comment indicating component installation defaults to YES', () => {
    const indexPath = join(__dirname, 'index.mts')
    const content = readFileSync(indexPath, 'utf8')
    
    // Check that the comment indicates default to YES
    expect(content).toMatch(/let shouldInstallComponent = true; \/\/ Default to YES/)
  })
})