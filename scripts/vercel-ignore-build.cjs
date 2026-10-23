#!/usr/bin/env node
// Vercel "Ignored Build Step" (vercel.json → ignoreCommand).
// exit 0 = skip the build (deployment CANCELED), exit 1 = build normally.
// Rule: skip ONLY when the head commit comes from github-actions[bot] AND every file
// changed since the last successful deployment is outside the app (CI reports,
// tests, docs, workflows). Any doubt or error → build. Commits by people
// (tsrc4mm9gg-netizen etc.) always build, unless the message contains [vercel skip].
const { execFileSync } = require('node:child_process');

const BOT = /github-actions\[bot\]/i;
const NON_DEPLOY = [/^\.diagnostics\//, /^tests\//, /^docs\//, /^\.github\//, /\.md$/i];

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const build = reason => { console.log(`▶ build: ${reason}`); process.exit(1); };
const skip = reason => { console.log(`⏭ skip build: ${reason}`); process.exit(0); };

function decide(env = process.env) {
  const author = `${env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN || ''} ${git('log', '-1', '--format=%an <%ae>')}`;
  const message = env.VERCEL_GIT_COMMIT_MESSAGE || git('log', '-1', '--format=%B');
  if (/\[vercel skip\]/i.test(message)) return ['skip', 'commit message contains [vercel skip]'];
  if (!BOT.test(author)) return ['build', `author is not the CI bot (${author.trim()})`];

  const previous = env.VERCEL_GIT_PREVIOUS_SHA;
  if (!previous) return ['build', 'no previous deployment SHA'];
  try { git('cat-file', '-e', `${previous}^{commit}`); } catch {
    try { git('fetch', '--quiet', '--depth=50', 'origin', previous); git('cat-file', '-e', `${previous}^{commit}`); }
    catch { return ['build', `previous deployment ${previous} not available in clone`]; }
  }
  const files = git('diff', '--name-only', previous, 'HEAD').split('\n').filter(Boolean);
  const relevant = files.filter(file => !NON_DEPLOY.some(rule => rule.test(file)));
  if (relevant.length) return ['build', `changes since last deployment include app files: ${relevant.slice(0, 10).join(', ')}`];
  return ['skip', `CI bot commit, only non-deploy files changed since ${previous.slice(0, 7)}: ${files.join(', ') || '(none)'}`];
}

if (require.main === module) {
  try { const [action, reason] = decide(); (action === 'skip' ? skip : build)(reason); }
  catch (error) { build(`ignore script error: ${error.message}`); }
}
module.exports = { decide, NON_DEPLOY };
