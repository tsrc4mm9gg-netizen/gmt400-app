'use client';
import { useEffect } from 'react';

/** Rejestracja lekkiego service workera (public/sw.js). Na http://localhost / 127.0.0.1 tylko z flagą testową,
 *  żeby nie przechwytywał zapytań w lokalnych testach (page.route). */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    let flag = false;
    try { flag = localStorage.getItem('gmt400_sw') === '1'; } catch { /* prywatny tryb */ }
    if (local && !flag) return;
    if (location.protocol !== 'https:' && !local) return;
    const register = () => navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);
  return null;
}
