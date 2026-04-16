'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  created_at: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter');
      if (!response.ok) {
        // Only show error if it's not a 404 or table doesn't exist
        if (response.status !== 404) {
          throw new Error('Failed to fetch subscribers');
        }
      }
      const data = await response.json();
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setMessage({ type: 'error', text: 'Failed to load subscribers' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete subscriber');

      setMessage({ type: 'success', text: 'Subscriber deleted successfully' });
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      setMessage({ type: 'error', text: 'Failed to delete subscriber' });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'unsubscribed' : 'active';

    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update subscriber');

      setMessage({ type: 'success', text: 'Subscriber status updated' });
      fetchSubscribers();
    } catch (error) {
      console.error('Error updating subscriber:', error);
      setMessage({ type: 'error', text: 'Failed to update subscriber' });
    }
  };

  const handleExport = (exportFilter: 'all' | 'active') => {
    const url = exportFilter === 'active'
      ? '/api/admin/newsletter/export?status=active'
      : '/api/admin/newsletter/export';
    window.open(url, '_blank');
  };

  const handleCopyEmails = async (copyFilter: 'all' | 'active') => {
    const emailsToCopy = subscribers
      .filter((sub) => copyFilter === 'all' || sub.status === 'active')
      .map((sub) => sub.email)
      .join(', ');

    try {
      await navigator.clipboard.writeText(emailsToCopy);
      setMessage({ type: 'success', text: `Copied ${emailsToCopy.split(', ').length} emails to clipboard!` });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to copy emails:', error);
      setMessage({ type: 'error', text: 'Failed to copy emails to clipboard' });
    }
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === 'active').length,
    unsubscribed: subscribers.filter((s) => s.status === 'unsubscribed').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Newsletter subscribers</h1>
          <p className="text-gray-600">Manage your newsletter subscriber list</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total subscribers</h3>
            <p className="text-3xl font-bold text-primary mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active</h3>
            <p className="text-3xl font-bold text-primary mt-2">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Unsubscribed</h3>
            <p className="text-3xl font-bold text-primary mt-2">{stats.unsubscribed}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilter('unsubscribed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unsubscribed'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Unsubscribed ({stats.unsubscribed})
            </button>
          </div>

          {/* Copy Emails */}
          <div className="flex gap-2">
            <button
              onClick={() => handleCopyEmails('all')}
              className="px-4 py-2 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Copy All Emails
            </button>
            <button
              onClick={() => handleCopyEmails('active')}
              className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Active Emails
            </button>
          </div>
        </div>

        {/* Subscribers Table */}
        {filteredSubscribers.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">No subscribers found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden border-2 border-primary">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Subscribed</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{subscriber.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{subscriber.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            subscriber.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(subscriber.id, subscriber.status)}
                            className="text-primary hover:text-secondary font-medium"
                          >
                            {subscriber.status === 'active' ? 'Unsubscribe' : 'Reactivate'}
                          </button>
                          <button
                            onClick={() => handleDelete(subscriber.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
