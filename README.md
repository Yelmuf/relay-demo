# relay-demo

## Demo of React UI crashing on concurrent queries resolution in Relay

How to reproduce:

- Install dependencies
  ```bash
  pnpm install
  ```
- Run Relay compiler and then start the app
  ```bash
  pnpm run dev
  ```
- Go to http://localhost:3000/?id=1:Todo:1
- Observe todos list crash when `TodoDetailQuery` finishes:
  
  <video src="https://github.com/user-attachments/assets/346ab638-ca95-4f21-a98c-c33d76a6ab08">


This scenario is duplicated in tests:

- Start FE and BE apps
  ```bash
  pnpm run dev
  ```
- Run failing test that simulates the described bug from the above
  ```bash
  pnpm run test:unit
  ```
