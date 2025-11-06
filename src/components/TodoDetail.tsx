import { useState, FormEvent, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import "./TodoDetail.css";
import type { TodoDetailQuery as TodoDetailQueryType } from "./__generated__/TodoDetailQuery.graphql";
import type { TodoDetailUpdateMutation } from "./__generated__/TodoDetailUpdateMutation.graphql";

const MAX_ICON_LENGTH = 10;

const TodoDetailQuery = graphql`
  query TodoDetailQuery($id: ID!) {
    todo(id: $id) {
      id
      completed
      icon
      description {
        short
        long
      }
    }
  }
`;

const UpdateTodoMutation = graphql`
  mutation TodoDetailUpdateMutation($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      todo {
        id
        icon
        description {
          short
          long
        }
      }
    }
  }
`;

function TodoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
    }
  }, [id, navigate]);

  if (!id) {
    return null;
  }

  const data = useLazyLoadQuery<TodoDetailQueryType>(TodoDetailQuery, { id });
  const [commitUpdate, isUpdating] =
    useMutation<TodoDetailUpdateMutation>(UpdateTodoMutation);

  const todo = data.todo;

  if (!todo) {
    return (
      <div className="todo-detail-panel">
        <div className="todo-detail-header">
          <h2>Todo Not Found</h2>
          <button onClick={() => navigate("/")} className="close-button">
            ✕
          </button>
        </div>
      </div>
    );
  }

  const [icon, setIcon] = useState("");
  const [longDescription, setLongDescription] = useState("");

  useEffect(() => {
    setIcon(todo.icon || "");
    setLongDescription(todo.description.long || "");
  }, [todo.icon, todo.description.long]);

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    commitUpdate({
      variables: {
        input: {
          id: todo.id,
          short: todo.description.short,
          icon: icon.trim() || undefined,
          long: longDescription.trim() || undefined,
        },
      },
      onError: (error) => {
        console.error("Error updating todo:", error);
      },
    });
  };

  return (
    <div className="todo-detail-panel">
      <div className="todo-detail-header">
        <h2>Todo Details</h2>
        <button onClick={handleClose} className="close-button">
          ✕
        </button>
      </div>

      <div className="todo-detail-content">
        <div className="todo-detail-field">
          <label className="todo-detail-label">Status</label>
          <div className="todo-detail-text">
            {todo.completed ? "✓ Completed" : "○ Active"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="todo-detail-form">
          <div className="todo-detail-field">
            <label htmlFor="icon" className="todo-detail-label">
              Icon (emoji)
            </label>
            <input
              id="icon"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., 🎯 📝 ✨"
              className="todo-detail-input"
              maxLength={MAX_ICON_LENGTH}
            />
          </div>

          <div className="todo-detail-field">
            <label htmlFor="longDescription" className="todo-detail-label">
              Long Description
            </label>
            <textarea
              id="longDescription"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Add more details about this todo..."
              className="todo-detail-textarea"
              rows={5}
            />
          </div>

          <button
            type="submit"
            className="todo-detail-save-button"
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TodoDetail;
