import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { RelayEnvironmentProvider } from "react-relay";
import RelayEnvironment from "./RelayEnvironment";
import { TodoList } from "./components/TodoList";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";

const TodoDetail = React.lazy(() => import("./components/TodoDetail"));

function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <BrowserRouter>
        <div className="app">
          <header className="app-header">
            <h1>🎯 TODO App</h1>
            <p className="subtitle">
              Built with React 19, React Router, and Relay
            </p>
          </header>

          <nav className="app-nav">
            <Link to="/" className="nav-link">
              All Todos
            </Link>
          </nav>

          <main className="app-main">
            <ErrorBoundary
              fallback={<div>Oops - error thrown through router</div>}
            >
              <Routes>
                <Route
                  path="*"
                  element={
                    <Suspense
                      fallback={<div className="loading">Loading...</div>}
                    >
                      <TodoList />
                    </Suspense>
                  }
                  errorElement={<div>Oops</div>}
                />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>

        <Suspense fallback={"Detail loading..."}>
          <TodoDetail />
        </Suspense>
      </BrowserRouter>
    </RelayEnvironmentProvider>
  );
}

export default App;
