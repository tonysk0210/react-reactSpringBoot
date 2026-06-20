# Repository Guidelines

## Communication

Always respond in Traditional Chinese.

When searching the repository from CLI, prefer `rg`/`rg --files`. Narrow the directory and file globs first, and avoid scanning generated folders such as `frontend/node_modules`, `frontend/dist`, `backend/target`, and backend runtime logs unless the task specifically requires them.

## Project Structure & Module Organization

This repository has two primary modules:

- `backend/`: Spring Boot API under `src/main/java/com/example/backend`, runtime configuration under `src/main/resources`, SQL initialization under `src/main/resources/sql`, and tests under `src/test/java`.
- `frontend/`: Vite + React client under `src`, static sticker assets under `public`, environment files at the module root, and production output in `dist`.

Backend packages follow the existing boundaries:

- `controller/`: REST endpoints, mostly under `/api/v1`.
- `service/` and `service/impl/`: service contracts and workflow/business logic.
- `repository/`: Spring Data JPA repositories.
- `entity/`: JPA entities and relationship mappings.
- `dto/` and `payload/`: response DTOs and request payloads.
- `security/`: Spring Security, JWT validation, public path rules, and auth configuration.
- `config/`: CORS, Stripe, cache, and auditing configuration.
- `exception/`: global exception handling and custom exceptions.
- `scope/` and `constant/`: scoped-bean demos and shared constants.

Frontend code is organized around API helpers, route components, store state, and assets:

- `frontend/src/main.jsx`: route tree, providers, React Router loaders/actions, Stripe `Elements`, `AuthProvider`, Redux `Provider`, and toast container.
- `frontend/src/api/apiClient.js`: shared Axios instance, JWT `Authorization` header, CSRF token handling, credentials, and response interceptor behavior.
- `frontend/src/store/`: auth context plus current cart Redux slice/store; keep persistence behavior clear when changing `localStorage` or `sessionStorage`.
- `frontend/src/components/`: page and feature components for home/products, cart/checkout, login/profile/orders/admin, contact, layout, and errors.
- `frontend/src/utils/authRouteGuards.js`: route loader/action auth preflight helpers.

There is also a backend-scoped [backend/AGENTS.md](backend/AGENTS.md). Use it for backend-only work and keep frontend-specific rules in this root guide.

## Build, Test, and Development Commands

Run backend commands from `backend/`:

- `.\mvnw.cmd spring-boot:run`: start the backend locally.
- `.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=qa`: start with the QA profile.
- `.\mvnw.cmd test`: run backend tests.
- `.\mvnw.cmd clean test`: clean stale classes and run tests, useful after package/class renames.
- `.\mvnw.cmd clean package`: compile, test, and build the JAR.

Run frontend commands from `frontend/`:

- `npm install`: install dependencies.
- `npm run dev`: start the Vite development server.
- `npm run build`: create a production build.
- `npm run build:localhost`: build with localhost mode.
- `npm run build:dev`: build with dev mode.
- `npm run lint`: run ESLint.
- `npm run preview`: preview the production build.

## Coding Style & Naming Conventions

Use the existing style in nearby files. Java classes use `PascalCase`; methods, fields, and variables use `camelCase`. React components use `PascalCase` filenames such as `Profile.jsx`; hooks and helpers use `camelCase`.

Keep Spring stereotypes clear. Controllers should stay thin, services should own workflow decisions, repositories should focus on persistence queries, and DTO/payload classes should describe API shapes. Prefer constructor injection, usually via Lombok `@RequiredArgsConstructor`, and avoid adding new field injection.

For frontend changes, prefer existing React Router loader/action patterns, shared API calls through `frontend/src/api/apiClient.js`, and existing context/Redux patterns in `frontend/src/store`. Be careful when changing auth redirects: loaders/actions can run before a protected component renders, so protected data routes should use the existing `requireAuth(...)` style guard where appropriate.

## Backend Runtime Notes

The backend currently uses Spring Boot 3.5, Java 25, Spring Web, Data JPA, Validation, Security, Actuator, springdoc OpenAPI, JJWT, Stripe Java SDK, Spring Cache, Caffeine, H2, and MySQL runtime support.

Default local persistence uses file-based H2 at `jdbc:h2:file:./h2db/myDb;AUTO_SERVER=true`. `application.properties` points SQL initialization to `classpath:sql/schema.sql` and `classpath:sql/data.sql` with `spring.sql.init.mode=always`. When adding seed data that may run repeatedly, prefer idempotent patterns already used in the SQL files.

Security uses CSRF cookies, CORS origins from `stickerstore.cors.allowed-origins`, public path configuration, and JWT validation before `BasicAuthenticationFilter`. Update public/authenticated/admin route rules consistently across security config and frontend route guards.

Stripe secret configuration is loaded from `backend/src/main/resources/stripe.properties` through `StripeConfig`, which sets `Stripe.apiKey`. Do not commit real secrets or replace environment-variable fallbacks with hard-coded production credentials.

## Frontend Runtime Notes

The frontend currently uses React 19, React Router 7, Vite 8, Tailwind CSS 4, Bootstrap/Sass dependencies, Redux Toolkit, Axios, js-cookie, React Toastify, styled-components, Font Awesome, and Stripe React bindings.

API base URLs come from `VITE_API_BASE_URL` in `frontend/.env*`. The shared Axios client attaches `Authorization: Bearer <jwtToken>` from `localStorage`, uses `withCredentials: true`, fetches CSRF tokens from `/csrf-token`, and only intercepts responses for requests made through that shared instance.

The current route tree includes public home/products/about/contact/login/register/cart routes and protected checkout/order-success/orders/profile/admin routes. When changing auth behavior, trace `ProtectedRoute.jsx`, `auth-context.jsx`, `authRouteGuards.js`, loaders/actions, `redirectPath`, `skipRedirectPath`, and `logoutRedirect` together.

Stripe Elements wraps the router in `main.jsx`; descendants that call `useStripe()` or `useElements()` must stay inside that provider.

## Testing Guidelines

Backend tests use Spring Boot Test and JUnit. Name new backend tests `*Test.java` or `*Tests.java` and mirror the package path under `backend/src/test/java`. Add focused tests for service logic, repository behavior, validation, security-sensitive changes, and bug fixes.

The frontend currently has linting but no test runner configured. For frontend changes, run `npm run lint` and `npm run build`. Add a frontend test framework only as a deliberate project change.

For full-stack behavior changes, verify the smallest useful combination: backend tests for API/security/business logic, frontend lint/build for client code, and a manual browser check for visible UI or auth/checkout flows when practical.

## Commit & Pull Request Guidelines

Recent commits use short imperative/descriptive messages such as `add qa prod properties` or `mod customer_order`. Keep commits focused and concise.

Pull requests should include a brief summary, affected module (`backend`, `frontend`, or both), commands run, and screenshots or screen recordings for visible UI changes. Mention database/config changes, new environment variables, security-sensitive behavior changes, and any Stripe/auth/CSRF implications.

## Security & Configuration Tips

Do not commit real secrets. Review `backend/src/main/resources/*.properties`, `backend/src/main/resources/stripe.properties`, and `frontend/.env*` before committing.

Keep local database files, logs, build outputs, and dependency folders out of reviews unless they are intentionally changed. Be especially careful with `backend/logs`, `backend/h2db`, `backend/target`, `frontend/dist`, and `frontend/node_modules`.

When editing generated or environment-specific files, confirm whether the file is meant to be tracked before including it in a change.
