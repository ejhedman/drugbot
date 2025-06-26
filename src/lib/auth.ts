export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Simulated authentication - in a real app, this would connect to GitHub OAuth
export const mockUser: User = {
  email: "user@example.com",
  name: "John Doe"
};

export const authenticateUser = (email: string): User | null => {
  // For demo purposes, accept any email as valid
  if (email && email.includes('@')) {
    return {
      email,
      name: email.split('@')[0]
    };
  }
  return null;
}; 