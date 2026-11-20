import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { decide } = require('../scripts/vercel-ignore-build.cjs');

const BOT = 'github-actions[bot]';
let cwd;
let originalCwd;

const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const commit = (message) => {
  git('add', '.');
  git('commit', '-m', message);
  return git('rev-parse', 'HEAD');
};
const env = (overrides = {}) => ({ VERCEL_GIT_COMMIT_AUTHOR_LOGIN: BOT, ...overrides });

beforeEach(() => {
  originalCwd = process.cwd();
  cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'gmt-ignore-'));
  process.chdir(cwd);
  git('init');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'Synthetic test');
  git('config', 'commit.gpgsign', 'false');
  fs.mkdirSync(path.join(cwd, 'src'));
  fs.writeFileSync(path.join(cwd, 'src/app.txt'), 'base');
  commit('base');
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(cwd, { recursive: true, force: true });
});

describe('decide()', () => {
  it('builds a manual redeploy of the same bot commit', () => {
    const head = git('rev-parse', 'HEAD');
    expect(decide(env({ VERCEL_GIT_PREVIOUS_SHA: head, VERCEL_GIT_COMMIT_SHA: head }))).toEqual(['build', 'redeploy of the same commit']);
  });

  it('skips a bot commit that only changes docs or markdown', () => {
    const previous = git('rev-parse', 'HEAD');
    fs.mkdirSync(path.join(cwd, 'docs'));
    fs.writeFileSync(path.join(cwd, 'docs/guide.md'), '# guide');
    const head = commit('docs only');
    expect(decide(env({ VERCEL_GIT_PREVIOUS_SHA: previous, VERCEL_GIT_COMMIT_SHA: head }))[0]).toBe('skip');
  });

  it('builds when data/knowledge-slugs.json changes', () => {
    const previous = git('rev-parse', 'HEAD');
    fs.mkdirSync(path.join(cwd, 'data'));
    fs.writeFileSync(path.join(cwd, 'data/knowledge-slugs.json'), '[]');
    const head = commit('slugs');
    expect(decide(env({ VERCEL_GIT_PREVIOUS_SHA: previous, VERCEL_GIT_COMMIT_SHA: head }))[0]).toBe('build');
  });

  it('builds a human commit', () => {
    const previous = git('rev-parse', 'HEAD');
    fs.writeFileSync(path.join(cwd, 'src/app.txt'), 'human change');
    const head = commit('human');
    expect(decide({ VERCEL_GIT_COMMIT_AUTHOR_LOGIN: 'tsrc4mm9gg-netizen', VERCEL_GIT_PREVIOUS_SHA: previous, VERCEL_GIT_COMMIT_SHA: head })[0]).toBe('build');
  });

  it('skips when the message contains [vercel skip]', () => {
    fs.writeFileSync(path.join(cwd, 'src/app.txt'), 'skip me');
    const head = commit('release [vercel skip]');
    expect(decide(env({ VERCEL_GIT_PREVIOUS_SHA: head, VERCEL_GIT_COMMIT_SHA: head }))[0]).toBe('skip');
  });

  it('builds when there is no previous deployment SHA', () => {
    const head = git('rev-parse', 'HEAD');
    expect(decide(env({ VERCEL_GIT_COMMIT_SHA: head }))).toEqual(['build', 'no previous deployment SHA']);
  });
});
