import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from '../src/components/AuthForm';

test('login triggers onLoginSubmit callback', async () => {
  const mockLogin = jest.fn();

  render(<AuthForm onLoginSubmit={mockLogin} />);

  fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
    target: { value: 'test@example.com' },
  });

  fireEvent.change(screen.getByPlaceholderText('••••••••'), {
    target: { value: 'password123' },
  });

  const loginButtons = screen.getAllByRole('button', { name: /^login$/i });
  const submitButton =
    loginButtons.find(b => b.getAttribute('type') === 'submit') ||
    loginButtons[loginButtons.length - 1];

  fireEvent.click(submitButton);

  expect(mockLogin).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
