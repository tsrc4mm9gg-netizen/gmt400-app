'use client';
import { CategoryIcon } from './ui/CategoryIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ToolsLauncher() {
  const pathname = usePathname();
  const isHub = pathname === '/narzedzia' || pathname === '/narzedzia/';
  const isHome = pathname === '/' || pathname === '';
  if (isHub || isHome) return null;

  return (
    <Link
      href="/narzedzia"
      aria-label="Narzędzia"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        zIndex: 90,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 44,
        maxWidth: 'calc(100vw - 32px)',
        padding: '10px 16px',
        border: '1px solid var(--accent)',
        borderRadius: 12,
        background: 'var(--accent)',
        color: 'var(--accent-ink)',
        boxShadow: '0 4px 16px #0005',
        fontSize: 14,
        fontWeight: 700,
        lineHeight: '20px',
        textDecoration: 'none',
      }}
    >
      <CategoryIcon name="tools" className="h-5 w-5" />
      <span>Narzędzia</span>
    </Link>
  );
}
