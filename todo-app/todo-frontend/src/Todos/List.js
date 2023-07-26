import React from 'react';
import Todo from './Todo';

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <>
      {todos.map((todo, index) => (
        <React.Fragment key={todo.id}>
          <Todo todo={todo} onDelete={deleteTodo} onComplete={completeTodo} />
          {index !== todos.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </>
  );
};

export default TodoList;
