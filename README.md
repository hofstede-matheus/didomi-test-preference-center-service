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

# test coverage
$ npm run test:cov
```
