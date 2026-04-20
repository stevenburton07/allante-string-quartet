'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry for the inconvenience. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
