![Lambda Banner](lambda.png)  
# Lambda  [![build status](https://gitlab.com/James9074/lambda/badges/master/build.svg)](https://gitlab.com/James9074/lambda/commits/master) ![graphql](https://img.shields.io/badge/style-%E2%9C%93-blue.svg?style=flat&label=GraphQL) ![react](https://img.shields.io/badge/style-%E2%9C%93-blue.svg?style=flat&label=React) ![Docker](https://img.shields.io/badge/style-%E2%9C%93-blue.svg?style=flat&label=Docker&)
A code playground and micro api creation platform allowing developers to put scripts "on tap" without the need to stand up dedicated resources. This is what we get when we combine AWS Lambda and JSFiddle.

Created with love from [Kirasoft's Nodejs API Starter](https://github.com/kriasoft/nodejs-api-starter) repo.

## File Guidelines
`docker-compose.yml` - The production-ready docker-compose file.
`docker-compose.override.yml` - The development-ready docker-compose file, with app-code volume mounts and port exposures configured

The Dockerfiles are configured with the correct CMD entries for prod, so there's no `command` entry in the docker-compose.yml file, but the `docker-compose.override.yml` file does have a development friendly command that laucnhes the app in watch-mode.

## Getting Started (Dev)
```bash
git clone <repo>
docker-compose up -d # this will automatically run DB migrations
cd api && yarn docker-db-seed
# Optionally, if you want to rollback migrations and restore the database to a clean, unseeded state:
docker-db-reset
```

### Fun yarn shortcuts
**`cd api && ...`**
- `yarn docker-db-migrate` - runs the migrations. Useful on first start or after writing a migration file
`- yarn docker-db-seed` - Seeds the DB with [Faker](https://www.npmjs.com/package/Faker) data
- `yarn docker-db-reset` - Rolls back all migrations and runs `docker-db-migrate` for you. Effectively gives a clean slate.
- `yarn docker-db-rollback`- Rolls back the DB, but doesn't restore it.

## Getting Started (Prod)
```bash
git clone <repo>
./build-prod  # Just a shortcut for building with the prod docker-compose file. This is critical, since the override file (dev) will build with volume mounts, which is bad.
docker-compose -f docker-compose.yml up -d # Starts the services in prod mode without the dev volumes
```

### Prod Notes
The `docker-compose.yml` build only incudes the build output, meaning `/src`, `/test`, `/db`, and a few other things are not in the image.


### Quick GraphQL Query Examples
```graphql
mutation DeleteLambda($input: DeleteLambdaInput!) {
  deleteLambda(input: $input) {
    result
  }
}

mutation UpdateLambda($updateInput: UpdateLambdaInput!) {
  updateLambda(input: $updateInput) {
    lambda{
      id,
      name,
      slug,
      code,
      updatedAt
    }
  }
}

query GetCurrentUser {
  me {
    id
    displayName
    lambdas {
      name,
      slug,
    }
  }
}

query GetSingleUser {
  node(id: "VXNlcjplMmQ5N2RiNi03YTE1LTExZTctYmQ1Zi0zMzk3NDBmMzQ5NGM=") {
    id
    ... on User {
      displayName
      username
      emails{
        email
      }
      lambdas {
        name
        slug
      }
    }
  }
}

query GetSingleUserById {
  user(id:"3339ee26-7a4d-11e7-9b78-87460c3a2f4b") {
    id
    displayName
    lambdas {
      name,
      slug,
    }
  }
}

query GetSingleUserByUsername {
  user(username:"Hillard.Streich46") {
    id
    displayName
    lambdas {
      name,
      slug,
    }
  }
}

query GetAllUsers {
  users(first: 10) {
    edges {
      node {
        id
        displayName
        lambdas {
          name
          slug
        }
      }
    }
  }
}

query GetAllLambdas {
  lambdas(first: 10) {
    edges {
      node {
        name
        slug
        owner_id,
        owner{
          displayName,
          username,
          emails{
            email
          }
        }
      }
    }
  }
}

query GetSingleLambdaBySlug {
  lambda(slug:"H1SxurWuW") {
    name,
    id,
    slug,
    owner{
      username
      id
    }
  }
}

query GetAllLambdasByUsername {
  lambdas(username:"Hillard.Streich46") {
    edges {
      node {
        name
        slug
        owner_id,
        owner{
          displayName,
          username,
          emails{
            email
          }
        }
      }
    }
  }
}

mutation CreateLambda($createInput: CreateLambdaInput!){
  createLambda(input: $createInput) {
    lambda{
      id
    }
  }
}

```

...and the inputs:

```JSON
{
  "input": {
    "slug": "H1SxurWuW"
  },
  "createInput": {
    "slug": "H1SxurWuW",
    "name": "test",
    "description": " test",
    "inputs": "[]",
    "code": "teasdasdst",
    "owner_id": "fc956662-822a-11e7-9da0-e7a666d18b85",
    "public": 1
  },
  "updateInput": {
    "slug": "H1SxurWuW",
    "name": "updated",
    "description": " test2",
    "inputs": "[]",
    "code": "teasdasdst",
    "owner_id": "fc956662-822a-11e7-9da0-e7a666d18b85",
    "public": 1
  }
}
```