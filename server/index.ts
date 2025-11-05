import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read schema
const schemaPath = path.join(__dirname, "schema.graphql");
const schemaString = fs.readFileSync(schemaPath, "utf-8");
const schema = buildSchema(schemaString);

// Type definitions
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  icon?: string;
  description?: string;
}

interface AddTodoInput {
  text: string;
  icon?: string;
  description?: string;
  clientMutationId?: string;
}

interface UpdateTodoInput {
  id: string;
  text: string;
  icon?: string;
  description?: string;
  clientMutationId?: string;
}

interface DeleteTodoInput {
  id: string;
  clientMutationId?: string;
}

interface ToggleTodoInput {
  id: string;
  clientMutationId?: string;
}

// In-memory data store
let todos: Todo[] = [
  { id: "1", text: "Learn React 19", completed: false },
  { id: "2", text: "Learn Relay", completed: false },
  { id: "3", text: "Build a TODO app", completed: true },
];

let nextId = 4;

// Root resolver
const root = {
  todos: (): Todo[] => todos,
  todo: ({ id }: { id: string }): Todo | undefined =>
    todos.find((todo) => todo.id === id),

  addTodo: ({ input }: { input: AddTodoInput }) => {
    const todo: Todo = {
      id: String(nextId++),
      text: input.text,
      completed: false,
      icon: input.icon,
      description: input.description,
    };
    todos.push(todo);
    return {
      todo,
      clientMutationId: input.clientMutationId,
    };
  },

  updateTodo: ({ input }: { input: UpdateTodoInput }) => {
    const todo = todos.find((t) => t.id === input.id);
    if (!todo) {
      throw new Error(`Todo with id ${input.id} not found`);
    }
    todo.text = input.text;
    if (input.icon !== undefined) {
      todo.icon = input.icon;
    }
    if (input.description !== undefined) {
      todo.description = input.description;
    }
    return {
      todo,
      clientMutationId: input.clientMutationId,
    };
  },

  deleteTodo: ({ input }: { input: DeleteTodoInput }) => {
    const index = todos.findIndex((t) => t.id === input.id);
    if (index === -1) {
      throw new Error(`Todo with id ${input.id} not found`);
    }
    todos.splice(index, 1);
    return {
      deletedTodoId: input.id,
      clientMutationId: input.clientMutationId,
    };
  },

  toggleTodo: ({ input }: { input: ToggleTodoInput }) => {
    const todo = todos.find((t) => t.id === input.id);
    if (!todo) {
      throw new Error(`Todo with id ${input.id} not found`);
    }
    todo.completed = !todo.completed;
    return {
      todo,
      clientMutationId: input.clientMutationId,
    };
  },
};

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// GraphQL endpoint
app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: root,
  }),
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});
