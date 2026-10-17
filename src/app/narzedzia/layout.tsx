'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
const DARK_PAGES = new Set(['/narzedzia/rpo','/narzedzia/diagnostyka','/narzedzia/kalkulatory']);
const THEME = `
[data-tool-theme="dark-v1"] main { box-sizing:border-box; width:100%; max-width:1000px; min-width:0; margin:0 auto; padding:20px 16px 120px; background:transparent !important; color:#ededed !important; }
[data-tool-theme="dark-v1"] main *, [data-tool-theme="dark-v1"] main *::before, [data-tool-theme="dark-v1"] main *::after { box-sizing:border-box; min-width:0; }
[data-tool-theme="dark-v1"] section, [data-tool-theme="dark-v1"] article { margin-bottom:16px; padding:20px; border:1px solid #343a43; border-radius:10px; background:#171d25 !important; color:#ededed !important; overflow-wrap:anywhere; }
[data-tool-theme="dark-v1"] [class*='bg-'] { background-color:#171d25 !important; background-image:none !important; }
[data-tool-theme="dark-v1"] [class*='text-'] { color:#d0d5dc !important; }
[data-tool-theme="dark-v1"] h1[class], [data-tool-theme="dark-v1"] h2[class] { color:#fafafa !important; }
[data-tool-theme="dark-v1"] p, [data-tool-theme="dark-v1"] li { line-height:1.65; }
[data-tool-theme="dark-v1"] label { display:block; color:#ededed !important; }
[data-tool-theme="dark-v1"] input[class], [data-tool-theme="dark-v1"] select[class], [data-tool-theme="dark-v1"] textarea[class] { display:block; width:100%; min-height:44px; margin-top:6px; padding:10px 12px; border:1px solid #596371; border-radius:7px; background:#101317 !important; color:#fafafa !important; -webkit-text-fill-color:#fafafa !important; font-size:16px; color-scheme:dark; }
[data-tool-theme="dark-v1"] input::placeholder, [data-tool-theme="dark-v1"] textarea::placeholder { color:#aab4c1 !important; -webkit-text-fill-color:#aab4c1 !important; opacity:1; }
[data-tool-theme="dark-v1"] option { background:#101317 !important; color:#fafafa !important; }
[data-tool-theme="dark-v1"] button[class] { min-height:44px; padding:10px 14px; border:1px solid #596371; border-radius:8px; background:#101317 !important; color:#f2cf85 !important; }
[data-tool-theme="dark-v1"] button[type='submit'] { background:#e7b95e !important; color:#111111 !important; border-color:#e7b95e; font-weight:700; }
[data-tool-theme="dark-v1"] button:disabled { opacity:.65; }
[data-tool-theme="dark-v1"] a[class] { color:#f2cf85 !important; }
[data-tool-theme="dark-v1"] [class*='bg-red-'] { background-color:#351b22 !important; }
[data-tool-theme="dark-v1"] [class*='text-red-'] { color:#ffb4b4 !important; }
[data-tool-theme="dark-v1"] [class*='bg-amber-'] { background-color:#302719 !important; }
[data-tool-theme="dark-v1"] [class*='text-amber-'] { color:#f2cf85 !important; }
[data-tool-theme="dark-v1"] input:focus-visible, [data-tool-theme="dark-v1"] select:focus-visible, [data-tool-theme="dark-v1"] button:focus-visible, [data-tool-theme="dark-v1"] a:focus-visible { outline:2px solid #e7b95e; outline-offset:3px; }
`;
export default function ToolsLayout({ children }:{ children:ReactNode }) {
 const pathname = usePathname();
 if (!DARK_PAGES.has(pathname.replace(/\/$/, ''))) return <>{children}</>;
 return <div data-tool-theme="dark-v1" data-theme-revision="embedded-v2" style={{color:'#ededed',colorScheme:'dark',width:'100%',minWidth:0}}><style>{THEME}</style>{children}</div>;
}
