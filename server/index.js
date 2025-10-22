const express = require('express');
const cors = require('cors');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');

// Read schema
const schemaPath = path.join(__dirname, 'schema.graphql');
const schemaString = fs.readFileSync(schemaPath, 'utf-8');
const schema = buildSchema(schemaString);

// In-memory data store
let todos = [
  { id: '1', text: 'Learn React 19', completed: false },
  { id: '2', text: 'Learn Relay', completed: false },
  { id: '3', text: 'Build a TODO app', completed: true },
];

let nextId = 4;

// Root resolver
const root = {
  todos: () => todos,
  todo: ({ id }) => todos.find(todo => todo.id === id),
  
  addTodo: ({ input }) => {
    const todo = {
      id: String(nextId++),
      text: input.text,
      completed: false,
    };
    todos.push(todo);
    return {
      todo,
      clientMutationId: input.clientMutationId,
    };
  },
  
  updateTodo: ({ input }) => {
    const todo = todos.find(t => t.id === input.id);
    if (!todo) {
      throw new Error(`Todo with id ${input.id} not found`);
    }
    todo.text = input.text;
    return {
      todo,
      clientMutationId: input.clientMutationId,
    };
  },
  
  deleteTodo: ({ input }) => {
    const index = todos.findIndex(t => t.id === input.id);
    if (index === -1) {
      throw new Error(`Todo with id ${input.id} not found`);
    }
    todos.splice(index, 1);
    return {
      deletedTodoId: input.id,
      clientMutationId: input.clientMutationId,
    };
  },
  
  toggleTodo: ({ input }) => {
    const todo = todos.find(t => t.id === input.id);
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
app.all('/graphql', createHandler({
  schema,
  rootValue: root,
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});
