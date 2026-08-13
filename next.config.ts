import type { NextConfig } from 'next';

/**
 * Long-lived caching for the two large static assets, mirroring what the
 * previous static deployment set via vercel.json. Everything else is left to
 * Next's own defaults, which already fingerprint and cache build output.
 */
const IMMUTABLE = 'public, max-age=31536000, immutable';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Fail the production build on type errors rather than shipping them.
  // Next 16 no longer runs ESLint during `next build`; `npm run verify` chains
  // typecheck -> lint -> build so CI still gates on all three.
  typescript: { ignoreBuildErrors: false },

  /** The diagram used to live at a longer filename; keep that link working. */
  async redirects() {
    return [
      {
        source: '/architecture-chatbot.svg',
        destination: '/architecture.svg',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path(portrait-manoj.png|architecture.svg|apple-touch-icon.png)',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
