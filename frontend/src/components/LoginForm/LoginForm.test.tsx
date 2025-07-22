import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';
import { useRouter } from 'next/router';

jest.mock('next/router');

describe('LoginForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('Rendering email and password input field and button', () => {
    render(<LoginForm onSubmit={mockSubmit} />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue as a guest' })).toBeInTheDocument();
  });

  it('Once submitted, onSubmit is being called with correct value', () => {
    render(<LoginForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'ryan@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'secret' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'ryan@example.com',
      password: 'secret'
    });
  });

  it('When Continue as a guest is clicked, router.push is called', () => {
    const router = useRouter();

    render(<LoginForm onSubmit={mockSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Continue as a guest' }));

    expect(router.push).toHaveBeenCalledWith('/dashboard');
  });
});