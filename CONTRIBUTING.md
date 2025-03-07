# Contributing to Lemon Lime SVGs

Thanks for your interest in contributing to Lemon Lime SVGs! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/lemon-lime-svgs.git`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Run tests: `npm test`

## Development Workflow

1. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests to ensure everything works: `npm test`
4. Commit your changes following the [Conventional Commits](https://www.conventionalcommits.org/) format
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a pull request against the main repository

## Pull Request Guidelines

- Provide a clear description of the changes in your PR
- Include any relevant issue numbers in the PR description
- Make sure all tests pass
- Update documentation if necessary
- Add an entry to the CHANGELOG.md file if your change is user-facing

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward-compatible manner
- PATCH version for backward-compatible bug fixes

## Testing

Please ensure that your contributions include appropriate tests:

```bash
npm test
```

## Code Style

We use ESLint and Prettier to maintain code quality and consistency:

```bash
npm run lint
npm run format
```

## Documentation

If your changes affect how users interact with the project, please update the README.md and other relevant documentation.

## Release Process

1. Update the version in package.json
2. Update CHANGELOG.md with the new version and changes
3. Commit these changes with the message "chore: release vX.Y.Z"
4. Tag the commit: `git tag vX.Y.Z`
5. Push changes and tags: `git push && git push --tags`
6. Create a new release on GitHub

## License

By contributing to Lemon Lime SVGs, you agree that your contributions will be licensed under the project's [GNU Lesser General Public License (LGPL)](./LICENSE.md).

## Questions?

If you have any questions or need help, please open an issue on GitHub.
