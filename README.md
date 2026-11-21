# Eko Samuel — Personal Portfolio

A personal portfolio presenting Eko Samuel’s work in AI and machine learning, full-stack development, backend engineering, and cloud infrastructure. It includes professional experience, project case studies, animated result showcases, services, and a contact form.

The frontend uses Next.js, React, TypeScript, and Sass, with GSAP and Motion for animation. A Python API handles contact submissions, storing data in hosted Neon PostgreSQL.

## Features

- Professional experience projects for ZandaTax, MTN, and NogicJQS.
- AI project case studies with explanations, result images, importance, future applications, and repository links.
- Contact messages forwarded by SMTP before being saved in PostgreSQL, with submission validation and duplicate protection.

## Local setup

Run all commands from the repository root. Use Node.js compatible with the installed Next.js version, Yarn as specified in [package.json](./package.json), and Python 3.9 or newer. Browser tests use Google Chrome.

```bash
yarn install
yarn setup:server
cp .env.example .env
```

Fill in the shared root `.env` using [.env.example](./.env.example):

| Variable | Purpose |
| --- | --- |
| `CONTACT_SERVER_URL` | Python API origin; locally `http://127.0.0.1:8000` |
| `CONTACT_API_KEY` | Shared server-to-server secret, at least 32 characters |
| `DATABASE_URL` | Neon pooled PostgreSQL URL with TLS enabled |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURITY` | SMTP connection settings |
| `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM` | Mailbox authentication and sender |

Keep secrets out of version control and do not prefix them with `NEXT_PUBLIC_`. Both applications read the root environment configuration. Database tables and schema additions are initialized automatically by the Python API.

### Start both applications

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). The Python API runs on port 8000.

### Start them separately

Use separate terminals:

```bash
# Frontend
yarn dev:web
```

```bash
# Python API
yarn dev:server
```

### Production build

```bash
yarn build
yarn start
```

These commands build and start the frontend. The Python API must run separately or be deployed separately.

For separate Vercel deployments, configure `CONTACT_SERVER_URL` with the deployed HTTPS API origin in the frontend project, set the same `CONTACT_API_KEY` in both projects, and configure Neon and SMTP variables in the Python server project. Redeploy affected projects after environment changes. Live email delivery requires working SMTP credentials.

## Project structure

| Location | Contents |
| --- | --- |
| [src/app/](./src/app/) | Portfolio routes and frontend API proxies |
| [src/components/](./src/components/) | UI components and animations |
| [src/data/](./src/data/) | Portfolio and project content |
| [server/](./server/) | Python API, PostgreSQL storage, and mail delivery |
| [server/tests/](./server/tests/) | Python unit tests and opt-in Neon integration tests |
| [tests/e2e/](./tests/e2e/) | Frontend validator unit tests and desktop/mobile browser tests |

## Testing: individual functions, files, and complete suites

Run the following commands from the repository root after installing dependencies. Python unit tests mock external services. The Neon integration test is opt-in and uses the database configured in the root environment. Frontend tests use Playwright; validator unit tests run through the same test runner without opening a browser.

### Stage 1: Python server unit tests

Run all Python tests. The external database integration test is skipped by default:

```bash
.venv/bin/python -m unittest discover -s server/tests -v
```

Run one file, using its module name without the `.py` extension:

```bash
.venv/bin/python -m unittest server.tests.test_contact -v
```

Run one test class:

```bash
.venv/bin/python -m unittest server.tests.test_contact.ContactTests -v
```

Run one test function:

```bash
.venv/bin/python -m unittest server.tests.test_database.DatabaseTests.test_rejects_insecure_connections -v
```

### Stage 2: Frontend validator unit tests

Run the email-draft utility test once under the desktop test project:

```bash
yarn test:e2e tests/e2e/routes.spec.ts --project=desktop --grep "email drafts"
```

### Stage 3: Frontend browser tests

Run all frontend tests on both desktop and mobile:

```bash
yarn test:e2e
```

Playwright starts the local application when necessary and reuses an existing server outside CI. Keep the root environment configured so the Python API can start. If Chrome is missing, install it before running browser tests:

```bash
yarn exec playwright install chrome
```

Run one test file:

```bash
yarn test:e2e tests/e2e/contact.spec.ts
```

Run one test by title, on desktop only:

```bash
yarn test:e2e tests/e2e/contact.spec.ts --project=desktop --grep "confirmed contact success"
```

Watch tests in a visible browser or use the interactive runner:

```bash
yarn test:e2e tests/e2e/contact.spec.ts --project=desktop --headed
yarn test:e2e --ui
```

Browser tests cover validation, contact feedback, navigation, responsive layouts, and project views. Contact browser tests intercept delivery/API responses; they do not verify production SMTP delivery.

### Stage 4: Neon integration tests

Include opt-in database integration tests with the complete Python suite:

```bash
RUN_AUTH_INTEGRATION=1 .venv/bin/python -m unittest discover -s server/tests -v
```

Integration tests use the configured Neon database, create temporary test records, and clean them up afterward. Email delivery is intercepted; these tests do not send live email.

### Stage 5: Static checks and production build

```bash
yarn lint
yarn typecheck
yarn format:check
yarn build
```

### Stage 6: Run backend and frontend suites together

Stop at the first failure:

```bash
.venv/bin/python -m unittest discover -s server/tests -v && yarn test:e2e
```

Include the Neon integration test and production checks:

```bash
RUN_AUTH_INTEGRATION=1 .venv/bin/python -m unittest discover -s server/tests -v && yarn test:e2e && yarn lint && yarn typecheck && yarn build
```
