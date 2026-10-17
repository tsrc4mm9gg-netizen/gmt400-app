'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import styles from './ToolTheme.module.css';
const DARK_PAGES = new Set(['/narzedzia/rpo','/narzedzia/diagnostyka','/narzedzia/kalkulatory']);
export default function ToolsLayout({ children }:{ children:ReactNode }) {
 const pathname = usePathname();
 return DARK_PAGES.has(pathname.replace(/\/$/, '')) ? <div className={styles.surface} data-tool-theme="dark-v1">{children}</div> : <>{children}</>;
}
