'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import type { Concert } from '@/types/concert';

interface ConcertFormProps {
  concert?: Concert;
  isEdit?: boolean;
}

export default function ConcertForm({ concert, isEdit = false }: ConcertFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: concert?.title || '',
    description: concert?.description || '',
    date: concert?.date ? concert.date.substring(0, 16) : '',
    location: concert?.location || '',
    venue: concert?.venue || '',
    ticket_link: concert?.ticket_link || '',
    image_url: concert?.image_url || '',
    status: concert?.is_published ? 'published' : 'draft',
    is_published: concert?.is_published ?? false,
    ticket_price: concert?.ticket_price ? concert.ticket_price / 100 : 0, // Convert cents to dollars
    max_attendees: concert?.max_attendees || 100,
    comp_code: concert?.comp_code || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
      // Automatically set is_published based on status
      ...(name === 'status' && { is_published: value === 'published' }),
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const url = isEdit ? `/api/concerts/${concert?.id}` : '/api/concerts';
      const method = isEdit ? 'PUT' : 'POST';

      // Convert dollar price to cents for storage
      const dataToSubmit = {
        ...formData,
        ticket_price: Math.round((formData.ticket_price || 0) * 100),
      };

      console.log('Submitting data:', dataToSubmit);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          data.errors.forEach((error: { path: string[]; message: string }) => {
            fieldErrors[error.path[0]] = error.message;
          });
          setErrors(fieldErrors);
          console.error('Validation errors:', data.errors);
        } else {
          console.error('Server error:', data);
          throw new Error(data.error || 'Failed to save concert');
        }
      } else {
        router.push('/admin/concerts');
        router.refresh();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to save concert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!concert?.id) return;

    const confirmed = confirm(
      'Are you sure you want to delete this concert? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/concerts/${concert.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete concert');
      }

      router.push('/admin/concerts');
      router.refresh();
    } catch (error) {
      console.error('Error deleting concert:', error);
      alert('Failed to delete concert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Concert Title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder="Mozart String Quartet in G Major"
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Describe the concert program, repertoire, and any special notes..."
        rows={5}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Date & Time"
          name="date"
          type="datetime-local"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
          helperText="Select the concert date and start time"
        />

        <Input
          label="Location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          error={errors.location}
          required
          placeholder="Provo, UT"
        />
      </div>

      <Input
        label="Venue (Optional)"
        name="venue"
        type="text"
        value={formData.venue}
        onChange={handleChange}
        error={errors.venue}
        placeholder="Balboa Park Pavilion"
      />

      <Input
        label="Ticket Link (Optional)"
        name="ticket_link"
        type="url"
        value={formData.ticket_link}
        onChange={handleChange}
        error={errors.ticket_link}
        placeholder="https://tickets.example.com/event"
        helperText="External ticketing website URL"
      />

      <Input
        label="Image URL (Optional)"
        name="image_url"
        type="url"
        value={formData.image_url}
        onChange={handleChange}
        error={errors.image_url}
        placeholder="https://example.com/concert-image.jpg"
        helperText="URL to concert poster or promotional image"
      />

      {/* Ticketing Section */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticketing information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Ticket price ($)"
            name="ticket_price"
            type="number"
            value={formData.ticket_price}
            onChange={handleChange}
            error={errors.ticket_price}
            required
            min="0"
            step="0.01"
            helperText="Set to $0 for free concerts"
          />

          <Input
            label="Maximum attendees"
            name="max_attendees"
            type="number"
            value={formData.max_attendees}
            onChange={handleChange}
            error={errors.max_attendees}
            required
            min="1"
            helperText="Total capacity for this concert"
          />
        </div>

        <Input
          label="Comp code (optional)"
          name="comp_code"
          type="text"
          value={formData.comp_code}
          onChange={handleChange}
          error={errors.comp_code}
          placeholder="COMP2024"
          helperText="Create a code for complimentary (free) tickets"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Concert status *
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
        <p className="mt-2 text-sm text-gray-600">
          Setting status to "Published" will make the concert visible on the website
        </p>
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <div>
          {isEdit && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete concert
            </Button>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/concerts')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEdit ? 'Update concert' : 'Create concert'}
          </Button>
        </div>
      </div>
    </form>
  );
}
