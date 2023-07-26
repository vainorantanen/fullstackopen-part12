import React from 'react';
import { render } from '@testing-library/react';
import Todo from './Todo';

test('renders Todo component with done todo', () => {
  const todo = {
    text: 'Write code',
    done: true,
  };
  const onDelete = jest.fn();
  const onComplete = jest.fn();

  const { getByText } = render(<Todo todo={todo} onDelete={onDelete} onComplete={onComplete} />);

  // eslint-disable-next-line testing-library/prefer-screen-queries
  expect(getByText(/Write code/i)).toBeInTheDocument();

});