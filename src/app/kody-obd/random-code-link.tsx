'use client';

import { useRouter } from 'next/navigation';
import { OBD_CODES } from '@/lib/obd-codes';

export default function RandomCodeLink() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        const randomCode = OBD_CODES[Math.floor(Math.random() * OBD_CODES.length)];
        router.push(`/kody-obd/${randomCode.code.toLowerCase()}`);
      }}
      className="inline-flex min-h-11 items-center rounded border border-white/20 bg-neutral-950 px-4 py-2 text-amber-400 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
    >
      Losowy kod
    </button>
  );
}
