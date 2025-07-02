'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signInWithEmail, signUpWithEmail, signInWithOtp, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setIsSigningIn(true);
    
    try {
      await signInWithEmail(email, password);
      setSuccess('Successfully signed in!');
      onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setIsSigningUp(true);
    
    try {
      await signUpWithEmail(email, password);
      setSuccess('Account created! Please check your email to verify your account.');
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setIsSendingOtp(true);
    
    try {
      await signInWithOtp(email);
      setSuccess('Magic link sent! Please check your email and click the link to sign in.');
    } catch (err: any) {
      console.error('Magic link error:', err);
      setError(err.message || 'Failed to send magic link. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isMagicLink) {
      handleMagicLink(e);
    } else {
      handleEmailLogin(e);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-accent border border-accent p-8 w-full max-w-xl">
      <h2 className="title text-center mb-6">Login</h2>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Sign in with your email address
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
                required
              />
            </div>
          </div>

          {!isMagicLink && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsMagicLink(!isMagicLink)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isMagicLink ? 'Use password instead' : 'Use magic link instead'}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSigningIn || isSigningUp || isSendingOtp}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isSigningIn || isSigningUp || isSendingOtp) ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            {isSigningIn ? 'Signing in...' : 
             isSigningUp ? 'Creating account...' :
             isSendingOtp ? 'Sending magic link...' :
             isMagicLink ? 'Send Magic Link' : 'Sign In'}
          </Button>

          {!isMagicLink && (
            <Button
              type="button"
              onClick={handleEmailSignUp}
              disabled={isLoading || isSigningIn || isSigningUp || isSendingOtp}
              variant="outline"
              className="w-full py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create New Account
            </Button>
          )}
        </form>
        
        {error && (
          <p className="text-sm text-red-600 text-center mt-4">{error}</p>
        )}
        
        {success && (
          <p className="text-sm text-green-600 text-center mt-4">{success}</p>
        )}
      </div>
    </div>
  );
} 