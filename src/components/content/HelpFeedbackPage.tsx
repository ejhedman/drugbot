'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

export interface HelpFeedbackFormData {
  message: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

interface HelpFeedbackPageProps {
  onSubmit?: (data: HelpFeedbackFormData) => Promise<void> | void;
  onCancel: () => void;
}

export function HelpFeedbackPage({ onSubmit, onCancel }: HelpFeedbackPageProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<HelpFeedbackFormData>({
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setFormData({
      message: value,
    });
    // Clear any previous error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      setSubmitError('Please enter your feedback or question.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // Include user information in the submission
      const submissionData: HelpFeedbackFormData = {
        message: formData.message,
        userId: user?.email, // Using email as user ID since that's what we have
        userEmail: user?.email,
        userName: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email,
      };

      // Call the provided callback or default to console.log
      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        console.log('Help/Feedback Form submitted:', submissionData);
      }
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          message: '',
        });
        setSubmitSuccess(false);
        onCancel(); // Close the form after successful submission
      }, 2000);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Help & Feedback</h2>
            <p className="text-gray-600 mt-1">
              We&apos;d love to hear from you! Send us your questions, suggestions, or feedback.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            ← Back to Detail View
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <Card className="w-full">
            <CardHeader>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-700">Send us a message</h3>
                <p className="text-slate-600 mt-2">
                  Your feedback helps us improve the system for everyone
                </p>
                {user ? (
                  <div className="text-sm text-slate-500 mt-1 space-y-1">
                    <p>Submitting as: <strong>{user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}</strong> ({user.email})</p>
                    <p className="text-xs">User ID: {user.email}</p>
                  </div>
                ) : (
                  <div className="text-sm text-red-500 mt-1">
                    <p>⚠️ No user information available</p>
                    <p className="text-xs">This may indicate an authentication issue</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                {/* Message Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="message">How Can I Help You?</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Please describe your question, issue, or feedback in detail. The more information you provide, the better we can assist you..."
                    rows={8}
                    className="resize-none w-full min-w-0"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Minimum 10 characters required
                  </p>
                </div>

                {/* Success/Error Messages */}
                {submitSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      ✓ Your message has been submitted successfully! We&apos;ll review it and get back to you if needed.
                    </p>
                  </div>
                )}
                
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">
                      ✗ {submitError}
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="px-6 py-2"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400"
                    disabled={isSubmitting || formData.message.trim().length < 10}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 