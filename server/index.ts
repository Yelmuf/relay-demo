import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// For the sake of the demo, we're not encoding this with base64
const gqlId = (typename: string, id: string | number) => {
  const VERSION = 1;
  return `${VERSION}:${typename}:${id}`;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read schema
const schemaPath = path.join(__dirname, "schema.graphql");
const schemaString = fs.readFileSync(schemaPath, "utf-8");
const schema = buildSchema(schemaString);

// Type definitions
interface TodoDescription {
  short: string;
  long?: string;
}

interface Todo {
  id: string;
  completed: boolean;
  icon?: string;
  description: TodoDescription;
}

interface AddTodoInput {
  short: string;
  long?: string;
  icon?: string;
  clientMutationId?: string;
}

interface UpdateTodoInput {
  id: string;
  short: string;
  long?: string;
  icon?: string;
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
  {
    id: gqlId("Todo", 1),
    description: { short: "Learn React 19" },
    completed: false,
  },
  {
    id: gqlId("Todo", 2),
    description: { short: "Learn Relay" },
    completed: false,
  },
  {
    id: gqlId("Todo", 3),
    description: { short: "Build a TODO app" },
    completed: true,
  },
];

let nextId = 4;

// Root resolver
const root = {
  todos: (): Todo[] => todos,
  todo: ({ id }: { id: string }): Todo | undefined =>
    todos.find((todo) => todo.id === id),

  addTodo: ({ input }: { input: AddTodoInput }) => {
    const todo: Todo = {
      id: gqlId("Todo", nextId++),
      description: {
        short: input.short,
        long: input.long,
      },
      completed: false,
      icon: input.icon,
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
    if (input.short !== undefined) {
      todo.description.short = input.short;
    }
    if (input.long !== undefined) {
      todo.description.long = input.long;
    }
    if (input.icon !== undefined) {
      todo.icon = input.icon;
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
  })
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});
