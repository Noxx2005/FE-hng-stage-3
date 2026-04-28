import { describe, it, expect, beforeEach } from 'vitest';
import { signup, login, getSession } from '@/lib/auth';

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('submits the signup form and creates a session', () => {
    const result = signup('user@example.com', 'password123');
    expect(result.success).toBe(true);

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session?.email).toBe('user@example.com');
  });

  it('shows an error for duplicate signup email', () => {
    signup('user@example.com', 'password123');
    const result = signup('user@example.com', 'password456');

    expect(result.success).toBe(false);
    expect(result.error).toBe('User already exists');
  });

  it('submits the login form and stores the active session', () => {
    signup('user@example.com', 'password123');
    localStorage.clear(); // Clear session to test login

    const result = login('user@example.com', 'password123');
    expect(result.success).toBe(true);

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session?.email).toBe('user@example.com');
  });

  it('shows an error for invalid login credentials', () => {
    signup('user@example.com', 'password123');

    const result = login('user@example.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
  });
});
