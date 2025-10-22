import React, { useState } from 'react';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import TodoItem from './TodoItem';
import './TodoList.css';

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
  mutation TodoListAddMutation($input: AddTodoInput!) {
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
  const data = useLazyLoadQuery(TodoListQuery, {});
  const [newTodoText, setNewTodoText] = useState('');
  const [commitAddTodo, isAddingTodo] = useMutation(AddTodoMutation);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    commitAddTodo({
      variables: {
        input: {
          text: newTodoText.trim(),
        },
      },
      onCompleted: () => {
        setNewTodoText('');
        // Refresh the page to see the new todo
        window.location.reload();
      },
      onError: (error) => {
        console.error('Error adding todo:', error);
      },
    });
  };

  const todos = data.todos || [];
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

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
          {isAddingTodo ? 'Adding...' : 'Add Todo'}
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
                {activeTodos.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
            
            {completedTodos.length > 0 && (
              <div className="todo-section">
                <h3>Completed</h3>
                {completedTodos.map(todo => (
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
