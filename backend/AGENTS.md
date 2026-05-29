# Backend Repository Guidelines

## Communication

Use Traditional Chinese for contributor-facing responses unless a task explicitly requires another language.

## Scope

This file applies only to the `backend/` module. Keep the parent-level `AGENTS.md` as the general guideline for the full React + Spring Boot repository. Do not add frontend-specific rules here.

## Project Structure & Module Organization

Backend source code lives under `src/main/java/com/example/backend`.

- `controller/`: REST endpoints, usually under `/api/v1`.
- `service/`: service interfaces.
- `service/impl/`: service implementations.
- `repository/`: Spring Data JPA repositories.
- `entity/`: JPA entities and persistence mappings.
- `dto/` and `payload/`: response DTOs and request payloads.
- `security/`: Spring Security, JWT, filters, and auth configuration.
- `config/`: application configuration such as CORS, cache, Stripe, and auditing.
- `exception/`: global exception handling and custom exceptions.

Runtime configuration and seed SQL live in `src/main/resources`. Tests belong under `src/test/java/com/example/backend`.

## Build, Test, and Development Commands

Run commands from `backend/`:

- `.\mvnw.cmd spring-boot:run`: start the backend locally.
- `.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=qa`: run with the QA profile.
- `.\mvnw.cmd test`: run all backend tests.
- `.\mvnw.cmd clean package`: compile, test, and build the JAR.

Use the Maven wrapper instead of a system Maven install when possible.

## Coding Style & Naming Conventions

Follow nearby code style. Java classes use `PascalCase`; methods, fields, and variables use `camelCase`.

Keep Spring stereotypes clear: controllers should not contain business logic, services should own workflow decisions, repositories should only handle persistence queries, and DTO/payload classes should stay focused on API shape.

Prefer constructor injection, typically through Lombok `@RequiredArgsConstructor`. Avoid adding new field injection with `@Autowired`.

## Security & API Guidelines

Preserve the existing Spring Security and JWT flow. Public, authenticated, and admin-only route rules should be updated in the security configuration consistently.

Request validation should use Jakarta Bean Validation annotations and `@Valid` at controller boundaries. Keep API error responses aligned with the existing global exception handling format.

Do not commit real secrets. Review `src/main/resources/*.properties`, `stripe.properties`, local database files, and logs before committing.

## Testing Guidelines

Backend tests use Spring Boot Test and JUnit. Name new tests `*Test.java` or `*Tests.java`, and mirror the package path of the code under test.

Run `.\mvnw.cmd test` before submitting backend changes. Add focused tests for service logic, repository behavior, validation, security-sensitive changes, and bug fixes.

## Commit & Pull Request Guidelines

Keep commits short and focused, matching the repository’s concise style such as `update`, `add qa prod properties`, or `mod customer_order`.

Pull requests should mention the affected backend area, commands run, database/config changes, and any security-sensitive behavior changes.
