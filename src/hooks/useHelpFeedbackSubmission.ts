import { useState } from 'react';
import { HelpFeedbackFormData } from '@/components/content/HelpFeedbackPage';

interface UseHelpFeedbackSubmissionOptions {
  onSubmit?: (data: HelpFeedbackFormData) => Promise<void> | void;
}

interface UseHelpFeedbackSubmissionReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  submitFeedback: (data: HelpFeedbackFormData) => Promise<void>;
  resetState: () => void;
}

export function useHelpFeedbackSubmission(
  options: UseHelpFeedbackSubmissionOptions = {}
): UseHelpFeedbackSubmissionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultSubmitHandler = async (data: HelpFeedbackFormData) => {
    // Prepare the request payload
    const requestPayload = {
      message: data.message,
      timestamp: new Date().toISOString(),
    };

    // Send to server API endpoint
    const response = await fetch('/api/help-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit feedback');
    }

    const result = await response.json();
    console.log('Help feedback submitted successfully:', result);
    
    return result;
  };

  const submitFeedback = async (data: HelpFeedbackFormData) => {
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
      console.error('Error submitting feedback:', err);
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
    submitFeedback,
    resetState,
  };
} 