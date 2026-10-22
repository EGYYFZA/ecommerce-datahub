# DataHub — Internet Package Store

A React and TypeScript demo for browsing internet packages, creating orders, and exploring a customer dashboard.

## Features

- Package catalog and promotions
- Demo sign-in and customer profile
- Simulated balance top-ups, orders, and transaction history

## Stack

React, TypeScript, Vite, Tailwind CSS, Express, and JSON Server.

## Run locally

```sh
cd ecommerce-datahub
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`. The application lives in the nested `ecommerce-datahub/` directory.

```sh
npm run build
npm run lint
node --test tests/query-parser.test.cjs
```

## Demo boundary

The JSON API is a local mock, with no server-side authentication or authorization. Demo credentials and balances are not real accounts or funds. Do not expose it through a tunnel, reverse proxy, or public deployment; do not enter real passwords or personal information. Loopback binding limits direct network access but does not add authentication.

Production use requires authenticated sessions, per-user authorization, password hashing, server-controlled payments and balances, and removal of mock credentials. API secrets must stay on the backend and must never be embedded in Vite configuration.

See [SECURITY.md](SECURITY.md).

Express currently pins an older `qs` minor release. The scoped override selects 6.16.1 to address its query-parser advisories; remove it when Express's dependency range includes the patched release.
