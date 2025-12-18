# relay-demo

## Demo of React UI crashing on concurrent queries resolution in Relay

How to reproduce:

- Install dependencies
  ```bash
  pnpm install
  ```
- Start server with GQL
  ```bash
  pnpm run server
  ```
- Start FE app
  ```bash
  pnpm run dev
  ```
- Go to http://localhost:3000/?id=1:Todo:1
- Observe todos list crash when `TodoDetailQuery` finishes

This scenario is duplicated in tests:

- Start server with GQL
  ```bash
  pnpm run server
  ```
- Start FE app
  ```bash
  pnpm run dev
  ```
- Run tests
  ```bash
  pnpm run test
  ```
