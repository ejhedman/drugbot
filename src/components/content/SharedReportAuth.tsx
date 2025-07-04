import { LoginForm } from '@/components/auth/LoginForm';
import { useState } from 'react';
import { RequestAccessForm } from '@/components/auth/RequestAccessForm';

interface SharedReportAuthProps {
  reportSlug: string;
  onLoginSuccess: () => void;
}

export function SharedReportAuth({ reportSlug, onLoginSuccess }: SharedReportAuthProps) {
  const [showRequestAccess, setShowRequestAccess] = useState(false);

  const handleRequestAccessClick = () => {
    setShowRequestAccess(true);
  };

  const handleRequestAccessCancel = () => {
    setShowRequestAccess(false);
  };

  const handleRequestAccessSubmit = async (data: { email: string; fullName: string }) => {
    const res = await fetch('/api/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send request');
    }
  };

  if (showRequestAccess) {
    return (
      <div className="flex items-center justify-center flex-1 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <RequestAccessForm
            onSubmit={handleRequestAccessSubmit}
            onCancel={handleRequestAccessCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-1 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Shared Report
          </h1>
          <p className="text-gray-600">
            Sign in to view the report: <span className="font-medium text-indigo-600">{reportSlug}</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <LoginForm onSuccess={onLoginSuccess} hideCreateAccount={true} />
        </div>
        <div className="text-center mt-6">
          <button
            onClick={handleRequestAccessClick}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Request access
          </button>
        </div>
      </div>
    </div>
  );
} 