import * as path from 'node:path'
import fsExtra from 'fs-extra'
import { installComponent } from './install-component.js'

// Mock inquirer to avoid interactive prompts in tests
jest.mock('inquirer', () => ({
  prompt: jest.fn()
}))

// Mock console methods to avoid spam during tests
jest.mock('chalk', () => ({
  yellow: jest.fn((str) => str),
  cyan: jest.fn((str) => str),
  red: jest.fn((str) => str),
  green: jest.fn((str) => str),
  gray: jest.fn((str) => str)
}))

describe('installComponent', () => {
  const mockPrompt = require('inquirer').prompt
  const mockCwd = '/tmp/test-install-component'
  
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock process.cwd to return our test directory
    jest.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    // Mock console.log to reduce test output
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should handle case where component directory path exists as a file', async () => {
    // Create test directory structure
    await fsExtra.ensureDir(mockCwd)
    await fsExtra.writeFile(path.join(mockCwd, 'package.json'), JSON.stringify({
      dependencies: { react: '^18.0.0' }
    }))
    
    // Create a file where a directory should be
    await fsExtra.ensureDir(path.join(mockCwd, 'src'))
    await fsExtra.writeFile(path.join(mockCwd, 'src', 'components'), 'some file content')

    // Mock inquirer responses
    mockPrompt
      .mockResolvedValueOnce({ framework: 'react' }) // Framework selection
      .mockResolvedValueOnce({ componentPath: 'src/components/Icon.tsx' }) // Component path

    // Call installComponent
    await installComponent()

    // Verify console.log was called with error message
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Cannot create directory at src/components because a file already exists there')
    )
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('No components were installed')
    )

    // Clean up
    await fsExtra.remove(mockCwd)
  })

  it('should successfully install component in existing directory', async () => {
    // Create test directory structure with proper directory
    await fsExtra.ensureDir(mockCwd)
    await fsExtra.writeFile(path.join(mockCwd, 'package.json'), JSON.stringify({
      dependencies: { react: '^18.0.0' }
    }))
    
    // Create proper directory structure
    await fsExtra.ensureDir(path.join(mockCwd, 'src', 'components'))

    // Mock inquirer responses
    mockPrompt
      .mockResolvedValueOnce({ framework: 'react' }) // Framework selection
      .mockResolvedValueOnce({ componentPath: 'src/components/Icon.tsx' }) // Component path

    // Call installComponent
    await installComponent()

    // Verify component file was created
    const componentExists = await fsExtra.pathExists(path.join(mockCwd, 'src', 'components', 'Icon.tsx'))
    expect(componentExists).toBe(true)

    // Verify success message
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Component installation complete')
    )

    // Clean up
    await fsExtra.remove(mockCwd)
  })

  it('should handle file overwrite scenario gracefully', async () => {
    // Create test directory structure
    await fsExtra.ensureDir(mockCwd)
    await fsExtra.writeFile(path.join(mockCwd, 'package.json'), JSON.stringify({
      dependencies: { react: '^18.0.0' }
    }))
    
    // Create directory and existing component file
    await fsExtra.ensureDir(path.join(mockCwd, 'src', 'components'))
    await fsExtra.writeFile(path.join(mockCwd, 'src', 'components', 'Icon.tsx'), 'existing content')

    // Mock inquirer responses
    mockPrompt
      .mockResolvedValueOnce({ framework: 'react' }) // Framework selection
      .mockResolvedValueOnce({ componentPath: 'src/components/Icon.tsx' }) // Component path
      .mockResolvedValueOnce({ overwrite: false }) // Don't overwrite

    // Call installComponent
    await installComponent()

    // Verify file was not overwritten (still has original content)
    const content = await fsExtra.readFile(path.join(mockCwd, 'src', 'components', 'Icon.tsx'), 'utf8')
    expect(content).toBe('existing content')

    // Verify appropriate message was shown
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('No components were installed')
    )

    // Clean up
    await fsExtra.remove(mockCwd)
  })
})