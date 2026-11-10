'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './MaterialContents.module.css';

type Entry = {
  id: string;
  label: string;
  level: number;
};

const HEADING_SELECTOR = 'h1, h2, h3';

function getLevel(tagName: string): number {
  if (tagName === 'H1') return 1;
  if (tagName === 'H2') return 2;
  return 3;
}

export default function MaterialContents({ entryId }: { entryId: string }) {
  const navRef = useRef<HTMLElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const nav = navRef.current;
    const contentRoot = nav?.closest('main') ?? document.body;

    if (!nav || !contentRoot) return;

    const usedIds = new Set<string>();
    const restoreCallbacks: Array<() => void> = [];
    const prefix = `material-${entryId.replace(/[^a-z0-9-]/gi, '') || 'entry'}`;

    const collectHeadings = () => {
      const headings = Array.from(
        contentRoot.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
      ).filter((heading) => {
        if (nav.contains(heading)) return false;
        if (!heading.textContent?.trim()) return false;
        if (heading.closest('[hidden], [aria-hidden="true"]')) return false;

        return true;
      });

      const nextEntries: Entry[] = [];

      headings.forEach((heading, index) => {
        const originalId = heading.getAttribute('id');
        const originalTabIndex = heading.getAttribute('tabindex');
        const originalScrollMarginTop = heading.style.scrollMarginTop;

        let headingId = originalId ?? '';
        let suffix = index + 1;

        if (
          !headingId ||
          usedIds.has(headingId) ||
          document.getElementById(headingId) !== heading
        ) {
          do {
            headingId = `${prefix}-${suffix++}`;
          } while (
            usedIds.has(headingId) ||
            (document.getElementById(headingId) &&
              document.getElementById(headingId) !== heading)
          );
        }

        usedIds.add(headingId);
        heading.id = headingId;

        if (originalTabIndex === null) {
          heading.tabIndex = -1;
        }

        heading.style.scrollMarginTop = '96px';

        nextEntries.push({
          id: headingId,
          label: heading.textContent?.trim() ?? '',
          level: getLevel(heading.tagName),
        });

        restoreCallbacks.push(() => {
          if (heading.id !== headingId) return;

          if (originalId === null) {
            heading.removeAttribute('id');
          } else {
            heading.setAttribute('id', originalId);
          }

          if (originalTabIndex === null) {
            heading.removeAttribute('tabindex');
          } else {
            heading.setAttribute('tabindex', originalTabIndex);
          }

          heading.style.scrollMarginTop = originalScrollMarginTop;
        });
      });

      setEntries(nextEntries);
    };

    collectHeadings();

    const observer = new MutationObserver(() => {
      requestAnimationFrame(collectHeadings);
    });

    observer.observe(contentRoot, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      restoreCallbacks.forEach((restore) => restore());
    };
  }, [entryId]);

  return (
    <nav
      ref={navRef}
      aria-label="Spis treści materiału"
      data-material-outline
      hidden={entries.length < 2}
      className={styles.outline}
      style={{
        background: 'var(--card-gradient)',
        color: '#ededed',
        border: '1px solid rgba(255,255,255,.14)',
        borderRadius: 10,
        padding: '8px 16px',
        margin: '16px 0',
        minWidth: 0,
      }}
    >
      <details>
        <summary
          style={{
            minHeight: 44,
            display: 'list-item',
            alignContent: 'center',
            cursor: 'pointer',
            color: 'var(--accent-soft)',
            fontWeight: 650,
          }}
        >
          Spis treści ({entries.length})
        </summary>

        <ol style={{ paddingLeft: 20, margin: '8px 0' }}>
          {entries.map((entry) => (
            <li
              key={entry.id}
              style={{
                marginLeft: entry.level === 3 ? 16 : 0,
                overflowWrap: 'anywhere',
              }}
            >
              <a
                href={`#${encodeURIComponent(entry.id)}`}
                style={{
                  display: 'block',
                  minHeight: 44,
                  padding: '10px 0',
                  color: '#d0d5dc',
                  textDecoration: 'underline',
                }}
                onClick={() => {
                  requestAnimationFrame(() => {
                    document
                      .getElementById(entry.id)
                      ?.focus({ preventScroll: true });
                  });
                }}
              >
                {entry.label}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
