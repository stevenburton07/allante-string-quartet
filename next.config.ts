import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Lint is a separate gate (`npm run lint`), not a build gate. The repo had no
  // ESLint config until now, so `next build` never linted; adding one would
  // otherwise fail deploys on pre-existing cosmetic issues.
  eslint: { ignoreDuringBuilds: true },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // camera=(self) — the admin QR check-in scanner calls getUserMedia.
          // camera=() blocks it for our own origin too, and the failure surfaces
          // as a misleading "check camera permissions" message.
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
