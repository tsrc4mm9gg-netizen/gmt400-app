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
      className={`${control} bg-neutral-950 text-amber-400 underline`}
    >
      Losowy kod
    </button>
  );
}
