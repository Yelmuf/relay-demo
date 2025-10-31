import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { RelayEnvironmentProvider } from "react-relay";
import RelayEnvironment from "./RelayEnvironment";
import TodoList from "./components/TodoList";
import { APP_CONSTANTS } from "./constants";
import "./App.css";

function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <BrowserRouter>
        <div className="app">
          <header className="app-header">
            <h1>{APP_CONSTANTS.TITLE}</h1>
            <p className="subtitle">{APP_CONSTANTS.SUBTITLE}</p>
          </header>

          <nav className="app-nav">
            <Link to="/" className="nav-link">
              {APP_CONSTANTS.NAV_ALL_TODOS}
            </Link>
          </nav>

          <main className="app-main">
            <Suspense
              fallback={<div className="loading">{APP_CONSTANTS.LOADING}</div>}
            >
              <Routes>
                <Route path="/" element={<TodoList />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </RelayEnvironmentProvider>
  );
}

export default App;
