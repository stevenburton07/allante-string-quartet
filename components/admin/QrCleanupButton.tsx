'use client';

import { useState } from 'react';

export default function QrCleanupButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleClick = async () => {
    const confirmed = window.confirm(
      'Delete QR code images for all events that ended more than 30 days ago?\n\n' +
        'Order records and check-in data are not affected — only the stored QR images. ' +
        'Customers re-opening old confirmation emails will see broken images for those events.'
    );
    if (!confirmed) return;

    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await fetch('/api/admin/cleanup-qrs', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Cleanup failed');
      }

      setMessage(
        `Deleted ${data.filesDeleted} QR file${data.filesDeleted === 1 ? '' : 's'} ` +
          `across ${data.eventsScanned} past event${data.eventsScanned === 1 ? '' : 's'}.`
      );
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Cleanup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Cleaning up…' : 'Clean up old QR codes'}
      </button>
      {message && (
        <p
          className={`text-sm ${
            isError ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
