# RelayXplore API

## Description

The RelayXplore API is a backend service that provides comprehensive data and analytics for relay networks. It offers endpoints to track, analyze, and monitor relay operations, performance metrics, and network statistics.


## Deployed Environments

| Environment | URL                          |
|-------------|------------------------------|
| Development | http://api-dev.relayxplore.com   |
| Staging     | http://api-staging.relayxplore.com |
| Production  | http://api.relayxplore.com       |

## Technologies used

- NestJS
- Postgres
- Redis
- Web3JS
- EtherJS
- TypeORM
- BullMQ

## Setup

- Clone the repository

```bash
$ npm install
```

## Running the app

- Make sure to have _Postgres_ installed
- Make sure to have _Redis_ installed
- Copy `env.example` to `.env ` then set the port
- Setup database credential in `.env`
- Install packages: `npm install` or `yarn install`
- Migrate the database: `npm run migrate:run` or `yarn migrate:run`
- Run the app in dev mode: `npm run start:dev` or `yarn start:dev`
- Run the app in prod mode: `npm run build && npm start:prod` or `yarn build && yarn start:prod`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## TypeORM CLI commands

- Create a new migration file: `npm run migrate:create --name=migration-name`
- Execute all the migration files: `npm run migrate:run` or `yarn migrate:run`
- Revert all the migration files: `npm run migrate:revert` or `yarn migrate:revert`

## Linting

- Check lint errors: `npm run lint` or `yarn lint`
- Fix lint errors: `npm run lint:fix` or `yarn lint:fix`

## Auditing

- Check audit errors: `npm run audit` or `yarn audit`
- Fix audit errors: `npm run audit:fix` or `yarn audit:fix`

## API DOC

- The API doc can be found here: `http://localhost:{PORT}/doc-api`
