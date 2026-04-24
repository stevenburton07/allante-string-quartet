'use client';

import { useState } from 'react';

interface CopyEmailsButtonProps {
  emails: string[];
  label?: string;
  variant?: 'primary' | 'secondary';
}

export default function CopyEmailsButton({ emails, label = 'Copy Emails', variant = 'secondary' }: CopyEmailsButtonProps) {
  const [message, setMessage] = useState<string | null>(null);

  const handleCopyEmails = async () => {
    if (emails.length === 0) {
      setMessage('No emails to copy');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const emailList = emails.join(', ');

    try {
      await navigator.clipboard.writeText(emailList);
      setMessage(`Copied ${emails.length} email${emails.length === 1 ? '' : 's'}!`);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to copy emails:', error);
      setMessage('Failed to copy emails');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopyEmails}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
          variant === 'primary'
            ? 'bg-primary text-white hover:bg-opacity-90 border-2 border-primary'
            : 'border-2 border-primary text-primary bg-transparent hover:bg-primary/10'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {label}
      </button>
      {message && (
        <div className="absolute top-full mt-2 left-0 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-800 whitespace-nowrap shadow-lg z-10">
          {message}
        </div>
      )}
    </div>
  );
}
