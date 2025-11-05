import { useState, FormEvent } from "react";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import TodoItem from "./TodoItem";
import { TODO_LIST_CONSTANTS } from "../constants";
import "./TodoList.css";
import type { TodoListQuery as TodoListQueryType } from "./__generated__/TodoListQuery.graphql";
import type { TodoListAddMutation } from "./__generated__/TodoListAddMutation.graphql";

const TodoListQuery = graphql`
  query TodoListQuery {
    todos {
      id
      text
      completed
    }
  }
`;

const AddTodoMutation = graphql`
  mutation TodoListAddMutation($input: AddTodoInput!) @raw_response_type {
    addTodo(input: $input) {
      todo {
        id
        text
        completed
      }
    }
  }
`;

function TodoList() {
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
          text: newTodoText.trim(),
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
          placeholder={TODO_LIST_CONSTANTS.INPUT_PLACEHOLDER}
          className="todo-input"
          disabled={isAddingTodo}
        />
        <button type="submit" className="todo-button" disabled={isAddingTodo}>
          {isAddingTodo
            ? TODO_LIST_CONSTANTS.BUTTON_ADDING
            : TODO_LIST_CONSTANTS.BUTTON_ADD}
        </button>
      </form>

      <div className="todo-stats">
        <span>
          {activeTodos.length} {TODO_LIST_CONSTANTS.STATS_ACTIVE}
        </span>
        <span>
          {completedTodos.length} {TODO_LIST_CONSTANTS.STATS_COMPLETED}
        </span>
      </div>

      <div className="todos-container">
        {todos.length === 0 ? (
          <p className="empty-state">{TODO_LIST_CONSTANTS.EMPTY_STATE}</p>
        ) : (
          <>
            {activeTodos.length > 0 && (
              <div className="todo-section">
                <h3>{TODO_LIST_CONSTANTS.SECTION_ACTIVE}</h3>
                {activeTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}

            {completedTodos.length > 0 && (
              <div className="todo-section">
                <h3>{TODO_LIST_CONSTANTS.SECTION_COMPLETED}</h3>
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

export default TodoList;
