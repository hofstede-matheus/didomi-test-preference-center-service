# didomi-test-preference-center-service

## Running the API

```bash
cp .env.example .env
cp .env.test.example .env.test

npm ci

docker-compose up db # In a separate terminal or --detach
npm run start:dev
```

## Tests

```bash
# all tests
$ npm run test

# unit tests
$ npm run test:unit

# integration tests
$ npm run test:e2e

# test coverage (84% line coverage 💪)
$ npm run test:cov
```

## API Docs

### Swagger Docs

<http:localhost:3001/docs>

### OpenAPI Spec

<http://localhost:3001/docs-json>
