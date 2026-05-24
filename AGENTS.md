# Repository Guidelines

## Project Structure & Module Organization

This repository is split into two main modules:

- `backend/`: Spring Boot API. Java source lives in `src/main/java/com/example/backend`, configuration and SQL seed files live in `src/main/resources`, and tests live in `src/test/java`.
- `frontend/`: Vite + React client. App code lives in `src`, static files in `public`, production output in `dist`, and dependencies in `node_modules`.

Keep backend controller, service, repository, DTO, payload, security, and config classes in their existing package folders. Keep frontend API helpers, components, store/context code, and assets under the matching `frontend/src` subfolders.

## Build, Test, and Development Commands

Run backend commands from `backend/`:

- `.\mvnw.cmd spring-boot:run`: start the Spring Boot API on the configured port.
- `.\mvnw.cmd test`: run backend tests.
- `.\mvnw.cmd clean package`: compile, test, and build the backend artifact.

Run frontend commands from `frontend/`:

- `npm install`: install frontend dependencies.
- `npm run dev`: start the Vite development server.
- `npm run build`: create a production build in `dist`.
- `npm run lint`: run ESLint over the frontend source.
- `npm run preview`: preview the production build locally.

## Coding Style & Naming Conventions

Use the existing style in nearby files. Java classes use `PascalCase`; methods, fields, and variables use `camelCase`. Keep Spring stereotypes clear: controllers in `controller`, service interfaces in `service`, implementations in `service/impl`, JPA entities in `entity`, and request/response shapes in `payload` or `dto`.

React components use `PascalCase` filenames such as `Profile.jsx`; hooks and helpers use `camelCase`. Prefer existing React Router loader/action patterns, context providers in `store`, and API calls through `frontend/src/api`.

## Testing Guidelines

Backend tests use Spring Boot Test/JUnit. Name new backend tests `*Tests.java` or `*Test.java` and place them under the same package path in `backend/src/test/java`. Run `.\mvnw.cmd test` before submitting backend changes.

The frontend currently has linting but no test runner configured. For frontend changes, run `npm run lint` and `npm run build`; add a test framework only as a deliberate project change.

## Commit & Pull Request Guidelines

Recent commits use short imperative/descriptive messages such as `add qa prod properties` or `mod customer_order`. Keep commits focused and concise.

Pull requests should include a brief summary, affected module (`backend`, `frontend`, or both), commands run, and screenshots or screen recordings for visible UI changes. Mention any configuration changes, new environment variables, or security-sensitive files.

## Security & Configuration Tips

Do not commit real secrets. Review `backend/src/main/resources/*.properties`, `stripe.properties`, and `frontend/.env` before committing. Keep local database files, logs, build outputs, and dependency folders out of reviews unless they are intentionally changed.
