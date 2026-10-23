'use client';
import { useRouter } from 'next/navigation';

/** Wraca do poprzedniej strony w obrębie serwisu (zachowuje wyszukiwanie i filtry); bez historii — idzie pod fallback. */
export default function BackLink({ fallback, label, className = '' }: { fallback: string; label: string; className?: string }) {
  const router = useRouter();
  return (
    <a
      href={fallback}
      onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        let sameOrigin = false;
        try { sameOrigin = !!document.referrer && new URL(document.referrer).origin === window.location.origin; } catch {}
        if (sameOrigin && window.history.length > 1) { event.preventDefault(); router.back(); }
      }}
      className={className}
    >
      {label}
    </a>
  );
}
