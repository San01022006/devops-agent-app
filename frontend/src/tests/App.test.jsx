import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import App from '../App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api', () => ({
  default: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  authAPI: {
    getMe: vi.fn().mockRejectedValue(new Error('No token')),
    login: vi.fn(),
    register: vi.fn(),
  },
  taskAPI: {
    getAll: vi.fn().mockResolvedValue({ data: [] }),
    getOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    dashboard: vi.fn().mockResolvedValue({
      data: { total_tasks: 0, completed_tasks: 0, pending_tasks: 0, progress_percentage: 0 },
    }),
  },
}));

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login page at /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders register page at /register route', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('redirects to login when accessing dashboard without auth', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });
});
