import ConcertForm from '@/components/concerts/ConcertForm';
import Link from 'next/link';

export default function NewConcertPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/concerts"
          className="text-sm text-primary hover:text-secondary transition-colors mb-4 inline-block"
        >
          ← Back to Concerts
        </Link>
        <h1 className="text-3xl font-bold text-primary">Add New Concert</h1>
        <p className="text-gray-600 mt-2">Create a new concert event</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <ConcertForm />
      </div>
    </div>
  );
}
