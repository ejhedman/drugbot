'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface LoginHelpFormData {
  helpType: string;
  name: string;
  email: string;
  additionalInfo: string;
}

interface LoginHelpFormProps {
  onSubmit?: (data: LoginHelpFormData) => Promise<void> | void;
  onCancel: () => void;
}

const helpOptions = [
  { value: 'login-issue', label: 'I am registered and I cannot log in' },
  { value: 'request-access', label: 'I am requesting access to the site' },
  { value: 'lost-credentials', label: "I've lost my credentials" }, // eslint-disable-line react/no-unescaped-entities
  { value: 'other', label: 'Other' },
];

export function LoginHelpForm({ onSubmit, onCancel }: LoginHelpFormProps) {
  const [formData, setFormData] = useState<LoginHelpFormData>({
    helpType: '',
    name: '',
    email: '',
    additionalInfo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: keyof LoginHelpFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear any previous error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // Call the provided callback or default to console.log
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        console.log('Login Help Form submitted:', formData);
      }
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          helpType: '',
          name: '',
          email: '',
          additionalInfo: '',
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
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-700">Login Help</h2>
            <p className="text-slate-600 mt-2">We&apos;re here to help you get access to your account</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* How Can I Help You Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="helpType">How Can I Help You?</Label>
              <Select 
                value={formData.helpType} 
                onValueChange={(value) => handleInputChange('helpType', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Please select an option..." />
                </SelectTrigger>
                <SelectContent>
                  {helpOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Address Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Additional Info Textarea */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Info</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Please provide any additional information that might help us assist you..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Success/Error Messages */}
            {submitSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✓ Your request has been submitted successfully! We&apos;ll get back to you soon.
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 