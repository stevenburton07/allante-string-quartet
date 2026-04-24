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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(concert?.image_url || null);

  const [formData, setFormData] = useState({
    title: concert?.title || '',
    description: concert?.description || '',
    date: concert?.date ? concert.date.substring(0, 16) : '',
    location: concert?.location || '',
    venue: concert?.venue || '',
    image_url: concert?.image_url || '',
    image_orientation: concert?.image_orientation || 'landscape',
    status: concert?.status || (concert?.is_published ? 'published' : 'draft'),
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image must be less than 5MB' }));
        return;
      }

      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: '' }));

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
    setIsSubmitting(true);
    setErrors({});

    try {
      let imageUrl = formData.image_url;

      // Upload image if a new one was selected
      if (imageFile) {
        setUploadingImage(true);
        const formDataImage = new FormData();
        formDataImage.append('file', imageFile);
        formDataImage.append('orientation', formData.image_orientation);

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

      const url = isEdit ? `/api/concerts/${concert?.id}` : '/api/concerts';
      const method = isEdit ? 'PUT' : 'POST';

      // Convert dollar price to cents for storage
      const dataToSubmit = {
        ...formData,
        image_url: imageUrl,
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

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
          Concert image (optional)
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        />
        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
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
          className="w-full max-w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <p className="mt-2 text-sm text-gray-600">
          Setting status to "Published" will make the concert visible on the website
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 pt-4">
        <div className="w-full sm:w-auto">
          {isEdit && (
            <div className="mt-8 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-gray-200">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                Delete concert
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/concerts')}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" size="lg" loading={isSubmitting || uploadingImage} disabled={isSubmitting || uploadingImage} className="w-full sm:w-auto">
            {uploadingImage ? 'Uploading image...' : isSubmitting ? 'Saving...' : isEdit ? 'Update concert' : 'Create concert'}
          </Button>
        </div>
      </div>
    </form>
  );
}
