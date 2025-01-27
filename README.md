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

# test coverage (93% line coverage 💪)
$ npm run test:cov
```

## API Docs

### Swagger Docs

<http:localhost:3001/docs>

### OpenAPI Spec

<http://localhost:3001/docs-json>

## Architecture & Design

### Architecture

```mermaid

C4Component
title Component diagram for REST API System

Boundary(external, "External", "") {
    ContainerDb(db, "Database", "PostgreSQL", "Stores application data")
    Person(user, "API Consumer")
}

Container_Boundary(api, "Nest.js API") {

    Boundary(infra_boundary, "Infrastructure", "") {
        Boundary(controller_boundary, "HTTP Controllers", "") {
            Component(ConsentController, "ConsentController")
            Component(UserController, "UserController")
        }

        Boundary(repository_implementation_boundary, "Repository Implementation", "") {
            Component(TypeOrmUserConsentRepository, "TypeOrmUserConsentRepository")
            Component(TypeOrmUsersRepository, "TypeOrmUsersRepository")
        }
    }

    Boundary(application_boundary, "Application", "") {
        Boundary(usecases_boundary, "Usecases", "") {
            Component(CreateUserUseCase, "CreateUserUseCase")
            Component(DeleteUserUseCase, "DeleteUserUseCase")
            Component(GetUserUseCase, "GetUserUseCase")
            Component(UpdateUserConsentUseCase, "UpdateUserConsentUseCase")
        }
    }

    Boundary(domain_boundary, "Domain", "") {
        Boundary(repository_interfaces_boundary, "Repository Interfaces", "") {
            Component(UserRepository, "UserRepository")
            Component(UserConsentRepository, "UserConsentRepository")
        }

        Boundary(services_boundary, "Services", "") {
            Component(UserService, "UserService")
        }

        Boundary(entities_boundary, "Entities", "") {
            Component(UserEntity, "UserEntity")
            Component(UserConsentEntity, "UserConsentEntity")
        }


    }

}

Rel(user, ConsentController, "Makes HTTP requests", "JSON/HTTPS")
Rel(user, UserController, "Makes HTTP requests", "JSON/HTTPS")

Rel(ConsentController, UpdateUserConsentUseCase, "Uses")
Rel(UserController, CreateUserUseCase, "Uses")
Rel(UserController, DeleteUserUseCase, "Uses")
Rel(UserController, GetUserUseCase, "Uses")

Rel(CreateUserUseCase, UserService, "Uses")
Rel(CreateUserUseCase, UserRepository, "Uses")
Rel(CreateUserUseCase, UserEntity, "Uses")

Rel(TypeOrmUsersRepository, UserRepository, "Implements")
Rel(TypeOrmUserConsentRepository, UserConsentRepository, "Implements")
Rel(TypeOrmUsersRepository, db, "Reads/Writes", "SQL")
Rel(TypeOrmUserConsentRepository, db, "Reads/Writes", "SQL")


UpdateLayoutConfig($c4ShapeInRow="1", $c4BoundaryInRow="2")
UpdateElementStyle(user, $offsetY="10")
UpdateRelStyle(user, controllers, $offsetX="5")

```

### Code Design

This Nest.js application is modular monolith with a clean architecture layered architecture. Each module of the application is divided into the following layers:

- **Domain Layer**: Contains the core of the application business logic of the application. Contains entities, domain errors, repositories interfaces, and domain services.

- **Application Layer**: Contains the use cases of the application, responsible for orchestrating the domain layer and the infrastructure layer.

- **Infrastructure Layer**: Contains the implementation of the repositories interfaces, database connection, and the presentation layer (controllers). In this case, the presentation layer is implemented using Nest.js HTTP controllers and the repositories are implemented using TypeORM/PostgreSQL.

Each module is divided in the layers above.

## Modules

- **User Module**: Contains the user agregate root, and every functionality related to user.

- **Consent Module**: Contains the consent agregate root, and every functionality related to the consent actor.

- **Core Module**: Contains the shared logic of the application, like the error handling, the validation pipe, and the configuration service.
