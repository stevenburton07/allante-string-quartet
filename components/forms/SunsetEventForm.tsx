'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface SunsetEvent {
  id?: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  rain_date: string;
  location_address: string;
  location_city: string;
  location_state: string;
  location_zip: string;
  max_tickets: number;
  ticket_price: number;
  status: string;
  published: boolean;
}

interface SunsetEventFormProps {
  event?: SunsetEvent;
  mode: 'create' | 'edit';
}

export default function SunsetEventForm({ event, mode }: SunsetEventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<SunsetEvent>>({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date || '',
    event_time: event?.event_time || '',
    rain_date: event?.rain_date || '',
    location_address: event?.location_address || '',
    location_city: event?.location_city || '',
    location_state: event?.location_state || '',
    location_zip: event?.location_zip || '',
    max_tickets: event?.max_tickets || 100,
    ticket_price: event?.ticket_price ? event.ticket_price / 100 : 20, // Convert cents to dollars
    status: event?.status || 'draft',
    published: event?.published || false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert dollar price to cents for storage
      const dataToSubmit = {
        ...formData,
        ticket_price: Math.round((formData.ticket_price || 0) * 100),
      };

      const url = mode === 'create'
        ? '/api/admin/sunset-series'
        : `/api/admin/sunset-series/${event?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save event');
      }

      const result = await response.json();

      // Redirect to the event list or edit page
      if (mode === 'create') {
        router.push(`/admin/sunset-series/${result.id}`);
      } else {
        router.push('/admin/sunset-series');
      }
      router.refresh();
    } catch (err: any) {
      console.error('Error saving event:', err);
      setError(err.message || 'Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event?.id) return;

    const confirmed = confirm(
      'Are you sure you want to delete this event? This action cannot be undone.'
    );

    if (!confirmed) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/sunset-series/${event.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      router.push('/admin/sunset-series');
      router.refresh();
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setError(err.message || 'Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Event Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Sunset Series: Summer Evening"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe the event..."
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
            Event Date *
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 mb-2">
            Event Time *
          </label>
          <input
            type="time"
            id="event_time"
            name="event_time"
            value={formData.event_time}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Rain Date */}
      <div>
        <label htmlFor="rain_date" className="block text-sm font-medium text-gray-700 mb-2">
          Rain Date (Optional)
        </label>
        <input
          type="date"
          id="rain_date"
          name="rain_date"
          value={formData.rain_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Event Location</h3>
        <p className="text-sm text-gray-600">
          This information will only be revealed to ticket purchasers
        </p>

        <div>
          <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            id="location_address"
            name="location_address"
            value={formData.location_address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="location_city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="location_city"
              name="location_city"
              value={formData.location_city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Seattle"
            />
          </div>

          <div>
            <label htmlFor="location_state" className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              id="location_state"
              name="location_state"
              value={formData.location_state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="WA"
            />
          </div>

          <div>
            <label htmlFor="location_zip" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              id="location_zip"
              name="location_zip"
              value={formData.location_zip}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="98101"
            />
          </div>
        </div>
      </div>

      {/* Ticketing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="max_tickets" className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Tickets *
          </label>
          <input
            type="number"
            id="max_tickets"
            name="max_tickets"
            value={formData.max_tickets}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="ticket_price" className="block text-sm font-medium text-gray-700 mb-2">
            Ticket Price ($) *
          </label>
          <input
            type="number"
            id="ticket_price"
            name="ticket_price"
            value={formData.ticket_price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Event Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center pt-8">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publish on website (make visible to public)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" size="lg" disabled={loading}>
          {loading ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Save Changes'}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.push('/admin/sunset-series')}
          disabled={loading}
        >
          Cancel
        </Button>

        {mode === 'edit' && (
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto bg-red-600 hover:bg-red-700"
          >
            Delete Event
          </Button>
        )}
      </div>
    </form>
  );
}
