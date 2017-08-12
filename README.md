![Lambda Banner](lambda.png)
# Lambda

Created with love from [Kirasoft's Nodejs API Starter](https://github.com/kriasoft/nodejs-api-starter) repo.

## File Guidelines
`docker-compose.yml` - The production-ready docker-compose file.
`docker-compose.override.yml` - The development-ready docker-compose file, with app-code volume mounts and port exposures configured

The Dockerfiles are configured with the correct CMD entries for prod, so there's no `command` entry in the docker-compose.yml file, but the `docker-compose.override.yml` file does have a development friendly command that laucnhes the app in watch-mode.

## Getting Started (Dev)
```bash
git clone <repo>
docker-compose up -d
cd api && yarn docker-db-seed
# Optionally, if you want to rollback migrations and restore the database to a clean, unseeded state:
docker-db-reset
```

### Fun yarn shortcuts
`cd api && ...`
`yarn docker-db-migrate` - runs the migrations. Useful on first start or after writing a migration file
`yarn docker-db-seed` - Seeds the DB with [Faker](https://www.npmjs.com/package/Faker) data
`yarn docker-db-reset` - Rolls back all migrations and runs `docker-db-migrate` for you. Effectively gives a clean slate.
`yarn docker-db-rollback`- Rolls back the DB, but doesn't restore it.

## Getting Started (Prod)
```bash
git clone <repo>
./build-prod  # Just a shortcut for building with the prod docker-compose file. This is critical, since the override file (dev) will build with volume mounts, which is bad.
docker-compose -f docker-compose.yml up -d # Starts the services in prod mode without the dev volumes
```

### Prod Notes
The `docker-compose.yml` build only incudes the build output, meaning `/src`, `/test`, `/db`, and a few other things are not in the image.