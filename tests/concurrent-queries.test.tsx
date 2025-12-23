import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { spawn } from "child_process";
import type { ChildProcess } from "child_process";
import { StrictMode } from "react";

describe("Concurrent Queries", () => {
  let serverProcess: ChildProcess;

  beforeAll(async () => {
    // Start GraphQL server
    serverProcess = spawn("npx", ["tsx", "server/index.ts"], {
      stdio: "inherit",
    });

    // Wait for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  afterAll(() => {
    // Stop GraphQL server
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it.fails(
    "Opening directly to a todo detail page breaks the list",
    async () => {
      // Given I am on the detail page for todo 1
      // Navigate to the page with the query parameter
      window.history.pushState({}, "", "/?id=1:Todo:1");

      // Dynamically import App to ensure it reads the current URL
      const { default: App } = await import("../src/App");

      render(
        <StrictMode>
          <App />
        </StrictMode>,
      );

      // Wait for "Learn React 19" to appear in the todo list (this means the list loaded)
      const todoText = await screen.findByText(
        /Learn React 19/i,
        {},
        { timeout: 10000 },
      );
      expect(todoText).toBeInTheDocument();

      // Wait for the todo detail panel to be visible and loaded
      // The artificial delays: 1000ms for list + 1500ms for detail = 2500ms total
      const todoDetailPanel = await screen.findByText(
        /Todo Details/i,
        {},
        { timeout: 10000 },
      );
      expect(todoDetailPanel).toBeInTheDocument();

      expect(
        screen.queryByText("Oops - error thrown through router"),
      ).not.toBeInTheDocument();
    },
  );
});
