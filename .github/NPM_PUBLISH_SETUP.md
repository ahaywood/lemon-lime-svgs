# Setting up npm Publishing with GitHub Actions

This project uses GitHub Actions to automatically publish to npm when a new release is created. To make this work, you need to set up an npm token as a GitHub secret.

## Steps to set up npm token

1. **Generate an npm Access Token**:
   - Log in to your npm account at [npmjs.com](https://www.npmjs.com/)
   - Go to your profile settings
   - Select "Access Tokens"
   - Click "Generate New Token"
   - Choose "Publish" as the token type
   - Copy the generated token (you won't be able to see it again)

2. **Add the token to GitHub Secrets**:
   - Go to your GitHub repository
   - Click on "Settings"
   - Select "Secrets and variables" → "Actions"
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste the npm token you generated
   - Click "Add secret"

## How the Workflow Works

The GitHub Action workflow will:

1. Trigger when a new release is created in GitHub
2. Set up Node.js
3. Install dependencies
4. Run tests
5. Build the project
6. Publish to npm using the stored token

## Troubleshooting

If the automatic publishing fails, check:

- The `NPM_TOKEN` secret is correctly set up
- The package version in `package.json` is updated and doesn't already exist on npm
- The npm account associated with the token has permission to publish to the package

## Manual Publishing

If needed, you can still publish manually:

```bash
npm login
npm publish
```