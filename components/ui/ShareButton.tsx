'use client';

export default function ShareButton() {
  return (
    <button
      onClick={() =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            'I just supported the Allante String Quartet! Join me in supporting live chamber music.'
          )}&url=${encodeURIComponent(window.location.origin)}`,
          '_blank'
        )
      }
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
    >
      Share
    </button>
  );
}
