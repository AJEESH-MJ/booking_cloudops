import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../src/pages/Home';

test('renders login form by default', () => {
  render(
    <MemoryRouter>
      <Home onLogin={() => {}} />
    </MemoryRouter>
  );

  expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0);
  expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
});
