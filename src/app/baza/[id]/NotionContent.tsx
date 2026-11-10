import type { ReactNode } from 'react';
import MaterialImage from '../../MaterialImage';
import { notionFetch } from '../../../lib/notion-fetch';

export function safeUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export async function readNotionBlocks(id: string, token: string): Promise<any[]> {
  let total = 0;
  const visited = new Set<string>();

  async function read(parent: string, depth: number): Promise<any[]> {
    if (depth > 10 || visited.has(parent)) {
      throw new Error('Nie można bezpiecznie odczytać całej struktury materiału.');
    }

    visited.add(parent);
    const output: any[] = [];
    const cursors = new Set<string>();
    let cursor: string | undefined;

    while (true) {
      const url = new URL(
        `${process.env.NOTION_API_BASE || 'https://api.notion.com'}/v1/blocks/${encodeURIComponent(parent)}/children`,
      );
      url.searchParams.set('page_size', '100');

      if (cursor) {
        url.searchParams.set('start_cursor', cursor);
      }

      const response = await notionFetch(url.toString(), { token, revalidate: 300 });

      if (!response.ok) {
        throw new Error('Nie udało się odczytać wszystkich bloków materiału.');
      }

      const data = await response.json();

      if (!Array.isArray(data.results) || typeof data.has_more !== 'boolean') {
        throw new Error('Nieprawidłowa odpowiedź bloków Notion.');
      }

      for (const block of data.results) {
        if (++total > 5000) {
          throw new Error('Materiał przekracza bezpieczny zakres odczytu.');
        }

        output.push({
          ...block,
          children: block.has_children ? await read(block.id, depth + 1) : [],
        });
      }

      if (!data.has_more) return output;

      const nextCursor: unknown = data.next_cursor;

      if (typeof nextCursor !== 'string' || !nextCursor || cursors.has(nextCursor)) {
        throw new Error('Nieprawidłowa paginacja bloków Notion.');
      }

      cursors.add(nextCursor);
      cursor = nextCursor;
    }
  }

  return read(id, 0);
}

function Rich({ parts = [] }: { parts?: any[] }): ReactNode {
  return parts.map((part, index) => {
    let value: ReactNode =
      part.plain_text || part.text?.content || part.equation?.expression || '';

    if (part.annotations?.code) value = <code>{value}</code>;
    if (part.annotations?.bold) value = <strong>{value}</strong>;
    if (part.annotations?.italic) value = <em>{value}</em>;
    if (part.annotations?.strikethrough) value = <s>{value}</s>;
    if (part.annotations?.underline) value = <u>{value}</u>;

    const href = safeUrl(part.href || part.text?.link?.url);

    return (
      <span key={index}>
        {href ? (
          <a
            href={href}
            className="text-silver-400 underline [overflow-wrap:anywhere]"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </span>
    );
  });
}

function Table({ rows }: { rows: any[] }): ReactNode {
  const [header, ...body] = rows;

  if (!header) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {(header.table_row?.cells || []).map((cell: any[], column: number) => (
              <th
                key={column}
                scope="col"
                className="border border-white/20 bg-neutral-900 p-2 text-left font-semibold"
              >
                <Rich parts={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => (
            <tr key={row.id}>
              {(row.table_row?.cells || []).map((cell: any[], column: number) => (
                <td key={column} className="border border-white/20 p-2 align-top">
                  <Rich parts={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NotionContent({ blocks }: { blocks: any[] }): ReactNode {
  const output: ReactNode[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];
    const data = block[block.type] || {};
    const rich = <Rich parts={data.rich_text} />;
    const children = block.children?.length ? (
      <NotionContent blocks={block.children} />
    ) : null;

    if (block.type === 'bulleted_list_item') {
      const items: ReactNode[] = [];

      while (index < blocks.length && blocks[index].type === 'bulleted_list_item') {
        const item = blocks[index];
        const itemData = item[item.type] || {};

        items.push(
          <li key={item.id || index}>
            <Rich parts={itemData.rich_text} />
            {item.children?.length ? <NotionContent blocks={item.children} /> : null}
          </li>,
        );

        index += 1;
      }

      output.push(
        <ul key={`ul-${block.id || index}`} className="list-disc space-y-1 pl-5">
          {items}
        </ul>,
      );
      continue;
    }

    if (block.type === 'numbered_list_item') {
      const items: ReactNode[] = [];

      while (index < blocks.length && blocks[index].type === 'numbered_list_item') {
        const item = blocks[index];
        const itemData = item[item.type] || {};

        items.push(
          <li key={item.id || index}>
            <Rich parts={itemData.rich_text} />
            {item.children?.length ? <NotionContent blocks={item.children} /> : null}
          </li>,
        );

        index += 1;
      }

      output.push(
        <ol key={`ol-${block.id || index}`} className="list-decimal space-y-1 pl-5">
          {items}
        </ol>,
      );
      continue;
    }

    let content: ReactNode;

    switch (block.type) {
      case 'paragraph':
        content = <p className="whitespace-pre-wrap leading-relaxed">{rich}</p>;
        break;
      case 'heading_1':
      case 'heading_2':
        content = <h2 className="mt-5 text-2xl text-silver-400">{rich}</h2>;
        break;
      case 'heading_3':
        content = <h3 className="mt-4 text-xl">{rich}</h3>;
        break;
      case 'quote':
      case 'callout':
        content = <blockquote className="border-l-2 border-silver-600 pl-4">{rich}</blockquote>;
        break;
      case 'code':
        content = (
          <pre className="overflow-x-auto rounded bg-neutral-900 p-3">
            <code>{rich}</code>
          </pre>
        );
        break;
      case 'divider':
        content = <hr className="border-white/20" />;
        break;
      case 'to_do':
        content = (
          <p>
            {data.checked ? '☑' : '☐'} {rich}
          </p>
        );
        break;
      case 'image': {
        const src = safeUrl(data.file?.url || data.external?.url);
        const caption = (data.caption || [])
          .map((part: any) => part.plain_text || part.text?.content || '')
          .join('');

        content = src ? (
          <MaterialImage src={src} caption={caption} />
        ) : (
          <p>Ilustracja ma niedostępny adres.</p>
        );
        break;
      }
      case 'table':
        content = <Table rows={block.children || []} />;
        break;
      case 'column_list':
      case 'column':
        content = null;
        break;
      case 'toggle':
        content = <p className="font-semibold">{rich}</p>;
        break;
      case 'bookmark':
      case 'link_preview':
      case 'embed':
      case 'video':
      case 'file':
      case 'pdf': {
        const href = safeUrl(data.url || data.file?.url || data.external?.url);

        content = href ? (
          <a
            href={href}
            className="text-silver-400 underline [overflow-wrap:anywhere]"
            rel="noopener noreferrer"
          >
            {data.name || 'Otwórz załącznik lub materiał źródłowy'}
          </a>
        ) : (
          <p>Załącznik ma niedostępny adres.</p>
        );
        break;
      }
      default:
        content = (
          <p className="text-sm text-neutral-400">
            Element Notion „{block.type}” nie jest jeszcze obsługiwany w tym widoku.
          </p>
        );
    }

    output.push(
      <div key={block.id || index} className="my-3">
        {content}
        {block.type !== 'table' && children}
      </div>,
    );

    index += 1;
  }

  return output;
}
