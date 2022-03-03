# Contributing Guidelines

## Testing

Before commiting changes, check if it makes sense to add or modify tests at test/unit (Unit tests that do not rely on any service) or test/integration (Integration tests that rely on other services, such as HKBase).

To run the tests, install the dependencies of HKLib (`npm install`) and run one of the following npm scripts (specified in the package.json):

- `npm run unit-tests`: Run only the Unit Tests.
- `npm run integration-tests`: Run only the integration tests (requires having an HKBase locally deployed or modifying the setup.json to point to a valid HKBase instance).
- `npm run tests`: Runs all unit Tests, than all integration tests.

## Building the distributable files

Before commiting new changes, whether on Typescript or Javascript files, run the clean and build script to generate the distributable versions:

`npm run clean-build-ts`

Avoid modifying the dist files using other means than running this script.
