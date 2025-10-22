import React, { useState } from 'react';
import { useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import './TodoItem.css';

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
      deletedTodoId
    }
  }
`;

function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  
  const [commitToggle] = useMutation(ToggleTodoMutation);
  const [commitUpdate] = useMutation(UpdateTodoMutation);
  const [commitDelete] = useMutation(DeleteTodoMutation);

  const handleToggle = () => {
    commitToggle({
      variables: {
        input: {
          id: todo.id,
        },
      },
      onCompleted: () => {
        window.location.reload();
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
        window.location.reload();
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      commitDelete({
        variables: {
          input: {
            id: todo.id,
          },
        },
        onCompleted: () => {
          window.location.reload();
        },
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="todo-checkbox"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={handleKeyDown}
          className="todo-edit-input"
          autoFocus
        />
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => setIsEditing(true)}
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
