import { useState, KeyboardEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import "./TodoItem.css";
import type { TodoItemToggleMutation } from "./__generated__/TodoItemToggleMutation.graphql";
import type { TodoItemUpdateMutation } from "./__generated__/TodoItemUpdateMutation.graphql";
import type { TodoItemDeleteMutation } from "./__generated__/TodoItemDeleteMutation.graphql";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  icon?: string | null;
}

interface TodoItemProps {
  todo: Todo;
}

const ToggleTodoMutation = graphql`
  mutation TodoItemToggleMutation($input: ToggleTodoInput!) {
    toggleTodo(input: $input) {
      todo {
        id
        completed
      }
    }
  }
`;

const UpdateTodoMutation = graphql`
  mutation TodoItemUpdateMutation($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      todo {
        id
        text
      }
    }
  }
`;

const DeleteTodoMutation = graphql`
  mutation TodoItemDeleteMutation($input: DeleteTodoInput!) {
    deleteTodo(input: $input) {
      deletedTodoId @deleteRecord
    }
  }
`;

function TodoItem({ todo }: TodoItemProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const [commitToggle] =
    useMutation<TodoItemToggleMutation>(ToggleTodoMutation);
  const [commitUpdate] =
    useMutation<TodoItemUpdateMutation>(UpdateTodoMutation);
  const [commitDelete] =
    useMutation<TodoItemDeleteMutation>(DeleteTodoMutation);

  const handleToggle = () => {
    commitToggle({
      variables: {
        input: {
          id: todo.id,
        },
      },
    });
  };

  const handleUpdate = () => {
    if (!editText.trim()) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }

    commitUpdate({
      variables: {
        input: {
          id: todo.id,
          text: editText.trim(),
        },
      },
      onCompleted: () => {
        setIsEditing(false);
      },
      optimisticResponse: {
        updateTodo: {
          todo: {
            id: todo.id,
            text: editText.trim(),
          },
        },
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      commitDelete({
        variables: {
          input: {
            id: todo.id,
          },
        },
        updater: (store) => {
          const todos = store.getRoot().getLinkedRecords("todos") || [];
          const updatedTodos = todos.filter(
            (t) => !!t && t.getDataID() !== todo.id,
          );
          store.getRoot().setLinkedRecords(updatedTodos, "todos");
        },
        optimisticResponse: {
          deleteTodo: {
            deletedTodoId: todo.id,
          },
        },
        optimisticUpdater: (store) => {
          const todos = store.getRoot().getLinkedRecords("todos") || [];
          const updatedTodos = todos.filter(
            (t) => !!t && t.getDataID() !== todo.id,
          );
          store.getRoot().setLinkedRecords(updatedTodos, "todos");
        },
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdate();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    if (!isEditing) {
      navigate(`/todo/${todo.id}`);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="todo-checkbox"
      />

      {todo.icon && <span className="todo-icon">{todo.icon}</span>}

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEditText(e.target.value)
          }
          onBlur={handleUpdate}
          onKeyDown={handleKeyDown}
          className="todo-edit-input"
          autoFocus
        />
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => setIsEditing(true)}
          onClick={handleClick}
        >
          {todo.text}
        </span>
      )}

      <div className="todo-actions">
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="todo-action-button edit"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="todo-action-button delete"
              title="Delete"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
