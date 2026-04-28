import { User, Session } from '@/types/auth';

const USERS_KEY = 'habit-tracker-users';
const SESSION_KEY = 'habit-tracker-session';

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session | null): void {
  if (typeof window === 'undefined') return;
  if (session === null) {
    localStorage.removeItem(SESSION_KEY);
  } else {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function signup(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    return { success: false, error: 'User already exists' };
  }

  const newUser: User = {
    id: Math.random().toString(36).slice(2),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  setSession({ userId: newUser.id, email: newUser.email });

  return { success: true };
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  setSession({ userId: user.id, email: user.email });
  return { success: true };
}

export function logout(): void {
  setSession(null);
}
