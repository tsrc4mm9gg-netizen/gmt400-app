'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ToolsLauncher() {
 const pathname = usePathname();
 const isHub = pathname === '/narzedzia' || pathname === '/narzedzia/';
 return <Link href="/narzedzia" aria-label="Narzędzia" data-tools-launcher style={{ position:'fixed', right:16, bottom:'calc(16px + env(safe-area-inset-bottom, 0px))', zIndex:90, display:isHub ? 'none' : 'inline-flex', alignItems:'center', justifyContent:'center', gap:8, minHeight:44, maxWidth:'calc(100vw - 32px)', padding:'10px 16px', border:'1px solid #e7b95e', borderRadius:12, background:'#e7b95e', color:'#111111', boxShadow:'0 4px 16px #0005', fontSize:14, fontWeight:700, lineHeight:'20px', textDecoration:'none' }}><span aria-hidden="true">🧰</span><span>Narzędzia</span></Link>;
}
