'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    const success = login(email);
    if (success) {
      onSuccess();
    } else {
      setError('Invalid email address');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-accent border border-accent p-8 w-full max-w-xl">
      <h2 className="title text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block label mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-w-80 px-4 py-2 border border-gray-300 rounded-xl focus-accent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg"
        >
          Login
        </button>
        {error && (
          <p className="text-sm text-red-600 text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  );
} 