#!/usr/bin/env node
/**
 * Generuje trwałe, SEO-przyjazne adresy slugowe bazy wiedzy GMT400.
 *
 * Źródło prawdy: baza Notion.
 * Artefakt: data/knowledge-slugs.json
 *
 * Wymagane zmienne środowiskowe:
 * - NOTION_TOKEN
 * - NOTION_DATABASE_ID
 *
 * Użycie:
 *   node scripts/generate-knowledge-slugs.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const TOKEN = process.env.NOTION_TOKEN;
const OUTPUT_PATH = path.resolve("data/knowledge-slugs.json");

if (!TOKEN) {
  console.error("Brak zmiennej środowiskowej NOTION_TOKEN.");
  process.exit(1);
}

if (!DATABASE_ID) {
  console.error("Brak zmiennej środowiskowej NOTION_DATABASE_ID.");
  process.exit(1);
}

const POLISH_MAP = new Map([
  ["ą", "a"], ["ć", "c"], ["ę", "e"], ["ł", "l"],
  ["ń", "n"], ["ó", "o"], ["ś", "s"], ["ź", "z"], ["ż", "z"],
]);

function normalizeTitle(title) {
  return title
    .replace(/[ąćęłńóśźż]/g, (character) => POLISH_MAP.get(character))
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[„”’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

function createSlug(title, usedSlugs) {
  const base = normalizeTitle(title) || "wpis";
  const count = (usedSlugs.get(base) ?? 0) + 1;
  usedSlugs.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
}

function extractTitle(page) {
  const titleProperty = Object.values(page.properties ?? {}).find(
    (property) => property.type === "title",
  );

  return (titleProperty?.title ?? [])
    .map((part) => part.plain_text ?? "")
    .join("")
    .trim();
}

async function fetchAllPages() {
  const pages = [];
  let cursor;

  do {
    const response = await fetch(`${NOTION_API}/databases/${DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cursor ? { start_cursor: cursor } : {}),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Notion API zwróciło ${response.status}: ${details}`);
    }

    const payload = await response.json();
    pages.push(...payload.results);
    cursor = payload.has_more ? payload.next_cursor : undefined;
  } while (cursor);

  return pages;
}

async function main() {
  const pages = await fetchAllPages();
  const usedSlugs = new Map();
  const entries = pages
    .map((page) => ({
      id: page.id.replaceAll("-", ""),
      title: extractTitle(page),
    }))
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(({ id, title }) => ({
      id,
      title,
      slug: createSlug(title, usedSlugs),
    }));

  const slugs = entries.map((entry) => entry.slug);
  const duplicates = slugs.length - new Set(slugs).size;

  if (duplicates > 0) {
    throw new Error(`Wygenerowano ${duplicates} zduplikowanych slugów.`);
  }

  const registry = {
    version: 1,
    source: `notion:database:${DATABASE_ID}`,
    count: entries.length,
    entries,
  };

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(registry, null, 2)}\n`, "utf8");

  console.log(`Wygenerowano ${entries.length} wpisów w ${OUTPUT_PATH}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
