import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database file in server directory
const dbPath = path.join(__dirname, "todos.db");
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Create todos table
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  )
`);

// Initialize with sample data if the table is empty
const count = db.prepare("SELECT COUNT(*) as count FROM todos").get() as {
  count: number;
};

if (count.count === 0) {
  const insert = db.prepare(
    "INSERT INTO todos (text, completed) VALUES (?, ?)",
  );
  insert.run("Learn React 19", 0);
  insert.run("Learn Relay", 0);
  insert.run("Build a TODO app", 1);
}

export interface Todo {
  id: number;
  text: string;
  completed: number;
}

// Database operations
export const todoDb = {
  // Get all todos
  getAll: (): Todo[] => {
    return db.prepare("SELECT * FROM todos ORDER BY id").all() as Todo[];
  },

  // Get single todo by id
  getById: (id: number): Todo | undefined => {
    return db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as
      | Todo
      | undefined;
  },

  // Create new todo
  create: (text: string): Todo => {
    const result = db
      .prepare("INSERT INTO todos (text, completed) VALUES (?, 0)")
      .run(text);
    const newTodo = todoDb.getById(result.lastInsertRowid as number);
    if (!newTodo) {
      throw new Error("Failed to create todo");
    }
    return newTodo;
  },

  // Update todo text
  update: (id: number, text: string): Todo | undefined => {
    db.prepare("UPDATE todos SET text = ? WHERE id = ?").run(text, id);
    return todoDb.getById(id);
  },

  // Toggle todo completed status
  toggle: (id: number): Todo | undefined => {
    db.prepare("UPDATE todos SET completed = NOT completed WHERE id = ?").run(
      id,
    );
    return todoDb.getById(id);
  },

  // Delete todo
  delete: (id: number): boolean => {
    const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);
    return result.changes > 0;
  },
};
