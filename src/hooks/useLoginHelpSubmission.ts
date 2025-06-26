import { useState } from 'react';
import { LoginHelpFormData } from '@/components/auth/LoginHelpForm';

interface UseLoginHelpSubmissionOptions {
  onSubmit?: (data: LoginHelpFormData) => Promise<void> | void;
}

interface UseLoginHelpSubmissionReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  submitHelpRequest: (data: LoginHelpFormData) => Promise<void>;
  resetState: () => void;
}

export function useLoginHelpSubmission(
  options: UseLoginHelpSubmissionOptions = {}
): UseLoginHelpSubmissionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultSubmitHandler = async (data: LoginHelpFormData) => {
    // Prepare the request payload
    const requestPayload = {
      helpType: data.helpType,
      name: data.name,
      email: data.email,
      additionalInfo: data.additionalInfo,
      timestamp: new Date().toISOString(),
    };

    // Send to server API endpoint
    const response = await fetch('/api/login-help', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit login help request');
    }

    const result = await response.json();
    console.log('Login help request submitted successfully:', result);
    
    return result;
  };

  const submitHelpRequest = async (data: LoginHelpFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Use provided handler or default to server submission
      if (options.onSubmit) {
        await options.onSubmit(data);
      } else {
        await defaultSubmitHandler(data);
      }
      
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error submitting login help request:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    submitHelpRequest,
    resetState,
  };
} 