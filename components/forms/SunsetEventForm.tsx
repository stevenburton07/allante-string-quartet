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
  difficulty: string;
  comp_code: string;
  location_address: string;
  location_city: string;
  location_state: string;
  location_zip: string;
  arrival_instructions: string;
  image_url?: string;
  image_orientation?: string;
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(event?.image_url || null);

  const [formData, setFormData] = useState<Partial<SunsetEvent>>({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date || '',
    event_time: event?.event_time || '',
    rain_date: event?.rain_date || '',
    difficulty: event?.difficulty || 'easy',
    comp_code: event?.comp_code || '',
    location_address: event?.location_address || '',
    location_city: event?.location_city || '',
    location_state: event?.location_state || '',
    location_zip: event?.location_zip || '',
    arrival_instructions: event?.arrival_instructions || '',
    image_url: event?.image_url || '',
    image_orientation: event?.image_orientation || 'landscape',
    max_tickets: event?.max_tickets || 75,
    ticket_price: event?.ticket_price ? event.ticket_price / 100 : 20, // Convert cents to dollars
    status: event?.status || 'draft',
    published: event?.status === 'published',
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
        // Automatically set published based on status
        ...(name === 'status' && { published: value === 'published' }),
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setImageFile(file);
      setError('');

      // Create preview and detect orientation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);

        // Detect image orientation
        const img = new Image();
        img.onload = () => {
          const orientation = img.width >= img.height ? 'landscape' : 'portrait';
          setFormData((prev) => ({ ...prev, image_orientation: orientation }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.image_url) {
      // Delete from storage
      const formDataDelete = new FormData();
      formDataDelete.append('imageUrl', formData.image_url);

      await fetch('/api/delete-image', {
        method: 'POST',
        body: formDataDelete,
      });
    }

    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = formData.image_url;

      // Upload image if a new one was selected
      if (imageFile) {
        setUploadingImage(true);
        const formDataImage = new FormData();
        formDataImage.append('file', imageFile);
        formDataImage.append('orientation', formData.image_orientation || 'landscape');

        // Send old image URL so it can be deleted
        if (formData.image_url) {
          formDataImage.append('oldImageUrl', formData.image_url);
        }

        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formDataImage,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { url, orientation } = await uploadResponse.json();
        imageUrl = url;
        // Update orientation from server response
        setFormData((prev) => ({ ...prev, image_orientation: orientation }));
        setUploadingImage(false);
      }

      // Convert dollar price to cents for storage
      const dataToSubmit = {
        ...formData,
        image_url: imageUrl,
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
          Event title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
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
          className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          placeholder="Describe the event..."
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
            Event date *
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
            className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 mb-2">
            Event time *
          </label>
          <input
            type="time"
            id="event_time"
            name="event_time"
            value={formData.event_time}
            onChange={handleChange}
            required
            className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Rain Date */}
      <div>
        <label htmlFor="rain_date" className="block text-sm font-medium text-gray-700 mb-2">
          Rain date (optional)
        </label>
        <input
          type="date"
          id="rain_date"
          name="rain_date"
          value={formData.rain_date}
          onChange={handleChange}
          className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>

      {/* Difficulty */}
      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
          Hike difficulty *
        </label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          required
          className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="easy">Easy - Suitable for all fitness levels, minimal elevation gain</option>
          <option value="moderate">Moderate - Some inclines, moderate fitness required</option>
          <option value="difficult">Difficult - Steep terrain, good fitness level needed</option>
        </select>
      </div>

      {/* Comp Code */}
      <div>
        <label htmlFor="comp_code" className="block text-sm font-medium text-gray-700 mb-2">
          Comp code (optional)
        </label>
        <input
          type="text"
          id="comp_code"
          name="comp_code"
          value={formData.comp_code}
          onChange={handleChange}
          className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          placeholder="COMP2024"
        />
        <p className="mt-2 text-sm text-gray-600">
          Create a code for complimentary (free) tickets
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
          Event image (optional)
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        />
        <p className="mt-1 text-sm text-gray-500">
          PNG, JPG, GIF up to 5MB
        </p>
        {imagePreview && (
          <div className="mt-4 flex items-start gap-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-semibold"
            >
              Remove image
            </button>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Event location</h3>
        <p className="text-sm text-gray-600">
          This information will only be revealed to ticket purchasers
        </p>

        <div>
          <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-2">
            Street address *
          </label>
          <input
            type="text"
            id="location_address"
            name="location_address"
            value={formData.location_address}
            onChange={handleChange}
            required
            className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
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
              className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
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
              className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="WA"
            />
          </div>

          <div>
            <label htmlFor="location_zip" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP code *
            </label>
            <input
              type="text"
              id="location_zip"
              name="location_zip"
              value={formData.location_zip}
              onChange={handleChange}
              required
              className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="98101"
            />
          </div>
        </div>

        <div>
          <label htmlFor="arrival_instructions" className="block text-sm font-medium text-gray-700 mb-2">
            Arrival instructions (optional)
          </label>
          <textarea
            id="arrival_instructions"
            name="arrival_instructions"
            value={formData.arrival_instructions}
            onChange={handleChange}
            rows={4}
            className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            placeholder="Detailed directions for reaching the event location..."
          />
          <p className="mt-2 text-sm text-gray-600">
            These instructions will only be visible to ticket purchasers
          </p>
        </div>
      </div>

      {/* Ticketing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ticket_price" className="block text-sm font-medium text-gray-700 mb-2">
            Ticket price ($) *
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
            className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="max_tickets" className="block text-sm font-medium text-gray-700 mb-2">
            Maximum tickets *
          </label>
          <input
            type="number"
            id="max_tickets"
            name="max_tickets"
            value={formData.max_tickets}
            onChange={handleChange}
            required
            min="1"
            className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Event status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <p className="mt-2 text-sm text-gray-600">
          Setting status to "Published" will make the event visible on the website
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 pt-4">
        <div className="w-full sm:w-auto">
          {mode === 'edit' && (
            <div className="mt-8 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-gray-200">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                Delete event
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => router.push('/admin/sunset-series')}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" size="lg" disabled={loading || uploadingImage} className="w-full sm:w-auto">
            {uploadingImage ? 'Uploading image...' : loading ? 'Saving...' : mode === 'create' ? 'Create event' : 'Save changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
