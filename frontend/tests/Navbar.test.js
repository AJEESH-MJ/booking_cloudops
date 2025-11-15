import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';

test('calls logout when logout button is clicked', () => {
  const mockLogout = jest.fn();

  render(
    <MemoryRouter>
      <Navbar user={{ name: 'User' }} onLogout={mockLogout} />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/logout/i));

  expect(mockLogout).toHaveBeenCalled();
});
