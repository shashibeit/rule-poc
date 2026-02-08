# RoleAudit UI – Page Reference

This project is a React + Vite UI that uses a MirageJS mock server in development. The goal is to provide a boilerplate UI where real APIs can be wired in later.

## How mock data works

- The mock server is defined in `src/mock/server.ts`.
- It is started only in development mode from `src/main.tsx`:
  ```ts
  if (import.meta.env.DEV) {
    makeServer();
  }
  ```
- MirageJS intercepts requests to `/api/*` and returns mock responses.

## API client

All API calls go through the small fetch wrapper in `src/api/client.ts`:

- Base URL: `/api`
- Supported methods: `get`, `post`, `put`, `delete`
- Query params are passed via a `params` object for `get` calls.

## Where to find page documentation

Each page has its own README with:

- route and role access
- form inputs and validations
- data flow (UI → state → API → store → UI)
- mock server endpoint and response shapes
- how to replace with a real API

See the index here:

- `docs/pages/README.md`
