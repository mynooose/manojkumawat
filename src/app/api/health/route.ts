import { NextResponse } from 'next/server';

/**
 * Liveness probe, and the reference example for adding server-side features.
 *
 * Route handlers run on Node at request time, so anything a backend needs —
 * a database call, a queued email, a third-party API — belongs in a sibling of
 * this file. A contact-form endpoint would be `src/app/api/contact/route.ts`
 * exporting `POST`.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'manojkumawat.com',
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
      timestamp: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
