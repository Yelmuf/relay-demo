import SchemaBuilder from "@pothos/core";
import { todoDb } from "./db.js";

// Create the schema builder
const builder = new SchemaBuilder({});

// Define the Todo type
const TodoType = builder.objectRef<{
  id: number;
  text: string;
  completed: number;
}>("Todo");

builder.objectType(TodoType, {
  fields: (t) => ({
    id: t.exposeID("id"),
    text: t.exposeString("text"),
    completed: t.exposeBoolean("completed", {
      resolve: (parent) => parent.completed === 1,
    }),
  }),
});

// Define input types
const AddTodoInput = builder.inputType("AddTodoInput", {
  fields: (t) => ({
    text: t.string({ required: true }),
    clientMutationId: t.string({ required: false }),
  }),
});

const UpdateTodoInput = builder.inputType("UpdateTodoInput", {
  fields: (t) => ({
    id: t.id({ required: true }),
    text: t.string({ required: true }),
    clientMutationId: t.string({ required: false }),
  }),
});

const DeleteTodoInput = builder.inputType("DeleteTodoInput", {
  fields: (t) => ({
    id: t.id({ required: true }),
    clientMutationId: t.string({ required: false }),
  }),
});

const ToggleTodoInput = builder.inputType("ToggleTodoInput", {
  fields: (t) => ({
    id: t.id({ required: true }),
    clientMutationId: t.string({ required: false }),
  }),
});

// Define payload types
const AddTodoPayload = builder.objectRef<{
  todo: { id: number; text: string; completed: number };
  clientMutationId?: string | null;
}>("AddTodoPayload");

builder.objectType(AddTodoPayload, {
  fields: (t) => ({
    todo: t.field({
      type: TodoType,
      resolve: (parent) => parent.todo,
    }),
    clientMutationId: t.string({
      nullable: true,
      resolve: (parent) => parent.clientMutationId ?? null,
    }),
  }),
});

const UpdateTodoPayload = builder.objectRef<{
  todo: { id: number; text: string; completed: number };
  clientMutationId?: string | null;
}>("UpdateTodoPayload");

builder.objectType(UpdateTodoPayload, {
  fields: (t) => ({
    todo: t.field({
      type: TodoType,
      resolve: (parent) => parent.todo,
    }),
    clientMutationId: t.string({
      nullable: true,
      resolve: (parent) => parent.clientMutationId ?? null,
    }),
  }),
});

const DeleteTodoPayload = builder.objectRef<{
  deletedTodoId: string;
  clientMutationId?: string | null;
}>("DeleteTodoPayload");

builder.objectType(DeleteTodoPayload, {
  fields: (t) => ({
    deletedTodoId: t.exposeID("deletedTodoId"),
    clientMutationId: t.string({
      nullable: true,
      resolve: (parent) => parent.clientMutationId ?? null,
    }),
  }),
});

const ToggleTodoPayload = builder.objectRef<{
  todo: { id: number; text: string; completed: number };
  clientMutationId?: string | null;
}>("ToggleTodoPayload");

builder.objectType(ToggleTodoPayload, {
  fields: (t) => ({
    todo: t.field({
      type: TodoType,
      resolve: (parent) => parent.todo,
    }),
    clientMutationId: t.string({
      nullable: true,
      resolve: (parent) => parent.clientMutationId ?? null,
    }),
  }),
});

// Define queries
builder.queryType({
  fields: (t) => ({
    todos: t.field({
      type: [TodoType],
      resolve: () => todoDb.getAll(),
    }),
    todo: t.field({
      type: TodoType,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (parent, args) => {
        const todo = todoDb.getById(Number(args.id));
        return todo ?? null;
      },
    }),
  }),
});

// Define mutations
builder.mutationType({
  fields: (t) => ({
    addTodo: t.field({
      type: AddTodoPayload,
      args: {
        input: t.arg({ type: AddTodoInput, required: true }),
      },
      resolve: (parent, args) => {
        const todo = todoDb.create(args.input.text);
        return {
          todo,
          clientMutationId: args.input.clientMutationId,
        };
      },
    }),
    updateTodo: t.field({
      type: UpdateTodoPayload,
      args: {
        input: t.arg({ type: UpdateTodoInput, required: true }),
      },
      resolve: (parent, args) => {
        const todo = todoDb.update(Number(args.input.id), args.input.text);
        if (!todo) {
          throw new Error(`Todo with id ${args.input.id} not found`);
        }
        return {
          todo,
          clientMutationId: args.input.clientMutationId,
        };
      },
    }),
    deleteTodo: t.field({
      type: DeleteTodoPayload,
      args: {
        input: t.arg({ type: DeleteTodoInput, required: true }),
      },
      resolve: (parent, args) => {
        const deleted = todoDb.delete(Number(args.input.id));
        if (!deleted) {
          throw new Error(`Todo with id ${args.input.id} not found`);
        }
        return {
          deletedTodoId: args.input.id,
          clientMutationId: args.input.clientMutationId,
        };
      },
    }),
    toggleTodo: t.field({
      type: ToggleTodoPayload,
      args: {
        input: t.arg({ type: ToggleTodoInput, required: true }),
      },
      resolve: (parent, args) => {
        const todo = todoDb.toggle(Number(args.input.id));
        if (!todo) {
          throw new Error(`Todo with id ${args.input.id} not found`);
        }
        return {
          todo,
          clientMutationId: args.input.clientMutationId,
        };
      },
    }),
  }),
});

// Build and export the schema
export const schema = builder.toSchema();
