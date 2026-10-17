'use client';
import Link from 'next/link';
import styles from './GroupedNavigation.module.css';

const GROUPS = [
 {
 title: 'Narzędzia',
 links: [
 { href: '/narzedzia/rpo', label: 'Wyszukiwarka RPO' },
 { href: '/narzedzia/kalkulatory', label: 'Kalkulator opon i przełożenia' },
 { href: '/narzedzia/diagnostyka', label: 'Kody OBD' }
 ]
 }
];

export default function GroupedNavigation() {
 return (
 <nav className={styles.navigation} aria-label="Narzędzia GMT400">
 {GROUPS.map(group => (
 <div key={group.title} className={styles.group}>
 <h2 className={styles.groupTitle}>{group.title}</h2>
 <ul className={styles.links}>
 {group.links.map(link => (
 <li key={link.href}>
 <Link href={link.href} className={styles.link}>{link.label}</Link>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </nav>
 );
}
