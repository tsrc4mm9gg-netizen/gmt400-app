'use client';
import Link from 'next/link';
import styles from './GroupedNavigation.module.css';

type Category = { id: string; label: string };

type Props = {
 categories: Category[];
 active: string;
 instance?: string;
 onSelect: (id: string) => void;
};

const TOOL_LINKS = [
 { href: '/narzedzia/rpo', label: 'Wyszukiwarka RPO' },
 { href: '/narzedzia/kalkulatory', label: 'Kalkulator opon' },
 { href: '/narzedzia/diagnostyka', label: 'Kody OBD' }
];

export default function GroupedNavigation({ categories, active, instance = 'default', onSelect }: Props) {
 return (
 <>
 {categories.map(category => (
 <button
 key={`${instance}-${category.id}`}
 type="button"
 onClick={() => onSelect(category.id)}
 className={`${styles.link} ${active === category.id ? styles.active : ''}`}
 >
 {category.label}
 </button>
 ))}
 <div className="col-span-full mt-2 border-t border-white/10 pt-3">
 <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">Narzędzia</p>
 <div className="flex flex-wrap gap-2">
 {TOOL_LINKS.map(link => (
 <Link key={link.href} href={link.href} className="rounded-lg bg-white/5 px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/10 hover:text-white">
 {link.label}
 </Link>
 ))}
 </div>
 </div>
 </>
 );
}
