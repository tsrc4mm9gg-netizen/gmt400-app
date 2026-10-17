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
 <Link href="/narzedzia" className="col-span-full mt-2 rounded-lg bg-amber-400 px-3 py-2 text-center text-sm font-semibold text-black transition hover:bg-amber-300">
 Narzędzia: kody RPO, OBD i kalkulatory
 </Link>
 </>
 );
}
