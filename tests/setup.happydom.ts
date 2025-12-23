import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock fetch to redirect /graphql requests to the GraphQL server on port 4000
beforeEach(() => {
  const originalFetch = global.fetch;
  
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Convert input to URL object
    let url: URL;
    if (typeof input === "string") {
      // If it's a relative URL, resolve it to port 4000
      if (input.startsWith("/")) {
        url = new URL(input, "http://localhost:4000");
      } else {
        url = new URL(input);
      }
    } else if (input instanceof URL) {
      url = input;
    } else {
      // It's a Request object
      url = new URL(input.url);
    }
    
    // If the path is /graphql, ensure it goes to port 4000
    if (url.pathname === "/graphql") {
      url.protocol = "http:";
      url.host = "localhost:4000";
    }
    
    return originalFetch(url.toString(), init);
  };
});
