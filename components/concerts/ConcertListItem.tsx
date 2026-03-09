'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Concert } from '@/types/concert';

interface ConcertListItemProps {
  concert: Concert;
}

export default function ConcertListItem({ concert }: ConcertListItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(concert.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const isPast = new Date(concert.date) < new Date();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${concert.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/concerts/${concert.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete concert');
      }

      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete concert. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-primary">{concert.title}</h3>
            {concert.is_published ? (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Published
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Draft
              </span>
            )}
            {isPast && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                Past
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-3">{formattedDate}</p>

          <div className="space-y-1">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Location:</span> {concert.location}
              {concert.venue && ` - ${concert.venue}`}
            </p>
            {concert.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{concert.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Link href={`/admin/concerts/${concert.id}`}>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-opacity"
              disabled={isDeleting}
            >
              Edit
            </button>
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
