import ConcertForm from '@/components/concerts/ConcertForm';
import Link from 'next/link';

export default function NewConcertPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/concerts"
          className="text-primary bg-transparent hover:bg-primary/10 font-semibold rounded-lg transition-all px-3 py-1.5 text-sm inline-flex items-center mb-4"
        >
          ← Back to concerts
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Add new concert</h1>
        <p className="text-gray-600 mt-2">Create a new concert event</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-8">
        <ConcertForm />
      </div>
    </div>
  );
}
