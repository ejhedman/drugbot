import { LoginForm } from '@/components/auth/LoginForm';
import { LoginHelpForm } from '@/components/auth/LoginHelpForm';
import { useState } from 'react';
import { useLoginHelpSubmission } from '@/hooks/useLoginHelpSubmission';

interface SharedReportAuthProps {
  reportSlug: string;
  onLoginSuccess: () => void;
}

export function SharedReportAuth({ reportSlug, onLoginSuccess }: SharedReportAuthProps) {
  const [showLoginHelp, setShowLoginHelp] = useState(false);
  const { submitHelpRequest } = useLoginHelpSubmission();

  const handleLoginHelpClick = () => {
    setShowLoginHelp(true);
  };

  const handleLoginHelpCancel = () => {
    setShowLoginHelp(false);
  };

  if (showLoginHelp) {
    return (
      <div className="flex items-center justify-center flex-1 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <LoginHelpForm 
            onSubmit={submitHelpRequest}
            onCancel={handleLoginHelpCancel}
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
          <LoginForm onSuccess={onLoginSuccess} />
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={handleLoginHelpClick}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Need help signing in?
          </button>
        </div>
      </div>
    </div>
  );
} 