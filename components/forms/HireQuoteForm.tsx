'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

interface FormData {
  name: string;
  email: string;
  eventType: string;
  address: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  performerType: string;
  additionalDetails: string;
}

const eventTypeOptions = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'party', label: 'Party' },
  { value: 'other', label: 'Other' },
];

const performerTypeOptions = [
  { value: 'solo-violin', label: 'Solo Violin' },
  { value: 'solo-viola', label: 'Solo Viola' },
  { value: 'solo-cello', label: 'Solo Cello' },
  { value: 'quartet', label: 'Full Quartet' },
];

export default function HireQuoteForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    eventType: '',
    address: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    performerType: '',
    additionalDetails: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/hire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Zod validation errors
          const fieldErrors: Partial<Record<keyof FormData, string>> = {};
          data.errors.forEach((error: { path: string[]; message: string }) => {
            const field = error.path[0] as keyof FormData;
            fieldErrors[field] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          throw new Error(data.error || 'Failed to submit form');
        }
      } else {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          eventType: '',
          address: '',
          eventDate: '',
          startTime: '',
          endTime: '',
          performerType: '',
          additionalDetails: '',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
        <div className="text-green-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Quote Request Sent!</h3>
        <p className="text-green-700 mb-6">
          Thank you for your interest. We'll respond to your quote request within 48 hours.
        </p>
        <Button onClick={() => setSubmitStatus('idle')} variant="primary">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'error' && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <p className="text-red-700 text-sm">
            There was an error submitting your request. Please try again or contact us directly at
            allantestringquartet@gmail.com
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Your Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="John Doe"
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="john@example.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Type of Event"
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          error={errors.eventType}
          options={eventTypeOptions}
          placeholder="Select event type"
          required
        />

        <Select
          label="Performer Type"
          name="performerType"
          value={formData.performerType}
          onChange={handleChange}
          error={errors.performerType}
          options={performerTypeOptions}
          placeholder="Select performer type"
          required
        />
      </div>

      <Input
        label="Event Address"
        name="address"
        type="text"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        required
        placeholder="123 Main St, Provo, UT 84601"
        helperText="Full address including city and state"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Event Date"
          name="eventDate"
          type="date"
          value={formData.eventDate}
          onChange={handleChange}
          error={errors.eventDate}
          required
        />

        <Input
          label="Start Time"
          name="startTime"
          type="time"
          value={formData.startTime}
          onChange={handleChange}
          error={errors.startTime}
          required
        />

        <Input
          label="End Time"
          name="endTime"
          type="time"
          value={formData.endTime}
          onChange={handleChange}
          error={errors.endTime}
          required
        />
      </div>

      <Textarea
        label="Additional Details (Optional)"
        name="additionalDetails"
        value={formData.additionalDetails}
        onChange={handleChange}
        error={errors.additionalDetails}
        placeholder="Tell us more about your event, music preferences, or any special requests..."
        rows={4}
      />

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Request Quote'}
        </Button>
      </div>
    </form>
  );
}
