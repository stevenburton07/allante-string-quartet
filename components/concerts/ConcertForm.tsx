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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          data.errors.forEach((error: { path: string[]; message: string }) => {
            fieldErrors[error.path[0]] = error.message;
          });
          setErrors(fieldErrors);
        } else {
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

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/concerts')}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update concert' : 'Create concert'}
        </Button>
      </div>
    </form>
  );
}
