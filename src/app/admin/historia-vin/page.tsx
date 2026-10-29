import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, adminConfigured, isAdmin } from '@/lib/vin-request-service';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';

export const metadata: Metadata = { title: 'Panel — prośby o historię VIN', robots: { index: false, follow: false, nocache: true } };
export const dynamic = 'force-dynamic';

export default async function AdminVinPage() {
  const configured = adminConfigured();
  const authed = configured && isAdmin((await cookies()).get(ADMIN_COOKIE)?.value);
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 text-white sm:py-10">
      <h1 className="mb-4 text-3xl font-bold text-silver-400">Prośby o historię VIN</h1>
      {!configured
        ? <p className="border border-white/10 bg-neutral-950 p-4 text-neutral-300" data-testid="admin-unconfigured">Panel nie jest jeszcze skonfigurowany: w środowisku brakuje zmiennej ADMIN_PASSWORD (min. 8 znaków).</p>
        : authed ? <AdminPanel /> : <AdminLogin />}
    </div>
  );
}
