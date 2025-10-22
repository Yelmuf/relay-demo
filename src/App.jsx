import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { RelayEnvironmentProvider } from 'react-relay';
import RelayEnvironment from './RelayEnvironment';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <BrowserRouter>
        <div className="app">
          <header className="app-header">
            <h1>🎯 TODO App</h1>
            <p className="subtitle">Built with React 19, React Router, and Relay</p>
          </header>
          
          <nav className="app-nav">
            <Link to="/" className="nav-link">All Todos</Link>
          </nav>

          <main className="app-main">
            <Suspense fallback={<div className="loading">Loading...</div>}>
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
