import { FormEvent, Suspense, useCallback, useTransition } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import "./TodoDetail.css";
import type { TodoDetailQuery as TodoDetailQueryType } from "./__generated__/TodoDetailQuery.graphql";
import type { TodoDetailUpdateMutation } from "./__generated__/TodoDetailUpdateMutation.graphql";
import { SyncContext, useIdFromSyncContext } from "../SyncContext";
import { ErrorBoundary } from "react-error-boundary";

const MAX_ICON_LENGTH = 10;

const TodoDetailQuery = graphql`
  query TodoDetailQuery($id: ID!) {
    todo(id: $id) {
      id
      completed
      icon
      description {
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
          long
        }
      }
    }
  }
`;

function TodoDetail({ id }: { id: string }) {
  const navigate = useNavigate();

  const { todo } = useLazyLoadQuery<TodoDetailQueryType>(
    TodoDetailQuery,
    {
      id,
    },
    {
      fetchPolicy: "store-and-network",
    }
  );
  const [commitUpdate, isUpdating] =
    useMutation<TodoDetailUpdateMutation>(UpdateTodoMutation);

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

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    commitUpdate({
      variables: {
        input: {
          id: todo.id,
          icon: formData.get("icon")?.toString()?.trim() || undefined,
          long:
            formData.get("longDescription")?.toString()?.trim() || undefined,
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

        <form
          key={todo.id}
          onSubmit={handleSubmit}
          className="todo-detail-form"
        >
          <div className="todo-detail-field">
            <label htmlFor="icon" className="todo-detail-label">
              Icon (emoji)
            </label>
            <input
              id="icon"
              type="text"
              name="icon"
              defaultValue={todo.icon ?? ""}
              // onChange={(e) => setIcon(e.target.value)}
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
              name="longDescription"
              defaultValue={todo.description.long || ""}
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

const TodoDetailConsumer = () => {
  const id = useIdFromSyncContext();

  return id ? (
    <Suspense fallback={<div className="todo-detail-panel">Loading....</div>}>
      <TodoDetail id={id} />
    </Suspense>
  ) : null;
};

const TodoDetailContainer = () => {
  const [searchParams, setSeatchParams] = useSearchParams();

  const id = searchParams.get("id");

  // const navigate = useNavigate();

  const [isPending, startTransition] = useTransition();

  const navigateToId = useCallback(
    (newId: string) => {
      // startTransition(() => {
      setSeatchParams((sp) => {
        sp.set("id", newId);
        return sp;
      });
      // });
    },
    [setSeatchParams]
  );

  return (
    <SyncContext.Provider value={{ id: id || null, navigateToId }}>
      <ErrorBoundary
        fallback={
          <div className="todo-detail-panel">Error loading todo details.</div>
        }
      >
        {/* <Suspense fallback={<div className="loading">Loading...</div>}> */}
        <TodoDetailConsumer />
        {/* </Suspense> */}
      </ErrorBoundary>
    </SyncContext.Provider>
  );
};

export default TodoDetailContainer;
