import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Logout from './Logout';
import { clearUser } from '@/store/authSlice';
import { useRouter } from 'next/router';
import * as ReactRedux from 'react-redux';
import { logout } from '@/utils/api';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/api', () => ({
  logout: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@/store/authSlice', () => ({
  clearUser: jest.fn(() => ({ type: 'auth/clearUser' })),
}));

describe('Logout Component', () => {
  let mockPush: jest.Mock;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    mockDispatch = jest.fn();

    // Mock next/router
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Mock redux dispatch
    jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(mockDispatch);
  });


  it('renders the logout button', () => {
    render(<Logout />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('calls logout, dispatches clearUser, and redirects on success', async () => {
    // Arrange: logout resolves
    (logout as jest.Mock).mockResolvedValue({ success: true });

    render(<Logout />);

    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    // Button shows "Logging out…" and is disabled
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/logging out…/i);

    // Wait for async actions
    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(clearUser());
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    // After completion, button returns to enabled state
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent(/logout/i);
  });

  it('shows error message on logout failure', async () => {
    // Arrange: logout rejects
    (logout as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(<Logout />);

    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    // Wait for error handling
    await waitFor(() => {
      // Error text should appear
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
      // Button should be re-enabled
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent(/logout/i);
    });

    // Ensure dispatch and redirect not called on failure
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});