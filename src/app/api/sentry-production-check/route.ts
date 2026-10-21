import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  Sentry.setTag('verification', 'production-end-to-end');
  Sentry.captureException(new Error('GMT400 temporary production Sentry verification'));
  await Sentry.flush(2000);

  return NextResponse.json({ ok: true, verification: 'sent' });
}
