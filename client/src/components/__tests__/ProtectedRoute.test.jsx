import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { UserContext } from '../../context/UserContext';

const renderWithRouter = ({ user }) =>
  render(
    <UserContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={['/secure']}>
        <Routes>
          <Route
            path="/secure"
            element={
              <ProtectedRoute>
                <div>Secure Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </UserContext.Provider>
  );

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderWithRouter({ user: null });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Secure Content')).not.toBeInTheDocument();
  });

  it('renders children for authenticated users', () => {
    renderWithRouter({ user: { id: '123', email: 'user@example.com' } });
    expect(screen.getByText('Secure Content')).toBeInTheDocument();
  });
});
