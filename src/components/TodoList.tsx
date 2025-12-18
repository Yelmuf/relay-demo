import { useState, FormEvent } from "react";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import TodoItem from "./TodoItem";
import "./TodoList.css";
import type { TodoListQuery as TodoListQueryType } from "./__generated__/TodoListQuery.graphql";
import type { TodoListAddMutation } from "./__generated__/TodoListAddMutation.graphql";

const TodoListQuery = graphql`
  query TodoListQuery {
    todos {
      id
      completed
      icon
      description {
        short
      }
    }
  }
`;

const AddTodoMutation = graphql`
  mutation TodoListAddMutation($input: AddTodoInput!) @raw_response_type {
    addTodo(input: $input) {
      todo {
        id
        completed
        icon
        description {
          short
        }
      }
    }
  }
`;

export function TodoList() {
  const data = useLazyLoadQuery<TodoListQueryType>(TodoListQuery, {});
  const [newTodoText, setNewTodoText] = useState("");
  const [commitAddTodo, isAddingTodo] =
    useMutation<TodoListAddMutation>(AddTodoMutation);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    commitAddTodo({
      variables: {
        input: {
          short: newTodoText.trim(),
        },
      },
      onCompleted: (response) => {
        response.addTodo.todo;
        setNewTodoText("");
      },
      onError: (error) => {
        console.error("Error adding todo:", error);
      },
      updater: (store) => {
        const newTodo = store.getRootField("addTodo")?.getLinkedRecord("todo");
        if (!newTodo) return;

        const root = store.getRoot();
        const todos = root.getLinkedRecords("todos") || [];
        root.setLinkedRecords([...todos, newTodo], "todos");
      },
    });
  };

  const todos = data.todos || [];
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="todo-list">
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
          disabled={isAddingTodo}
        />
        <button type="submit" className="todo-button" disabled={isAddingTodo}>
          {isAddingTodo ? "Adding..." : "Add Todo"}
        </button>
      </form>

      <div className="todo-stats">
        <span>{activeTodos.length} active</span>
        <span>{completedTodos.length} completed</span>
      </div>

      <div className="todos-container">
        {todos.length === 0 ? (
          <p className="empty-state">No todos yet. Add one above!</p>
        ) : (
          <>
            {activeTodos.length > 0 && (
              <div className="todo-section">
                <h3>Active</h3>
                {activeTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}

            {completedTodos.length > 0 && (
              <div className="todo-section">
                <h3>Completed</h3>
                {completedTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
