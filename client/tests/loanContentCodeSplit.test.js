import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('loan editorial content code split', () => {
  it('keeps educational sections and FAQs out of the shared initial entry', () => {
    const assetsDir = path.resolve(__dirname, '../dist/assets');
    const scripts = readdirSync(assetsDir).filter((name) => name.endsWith('.js'));
    const entryName = scripts.find((name) => /^index-.*\.js$/.test(name));
    assert.ok(entryName, 'built initial application entry exists; run npm run build before tests');

    const entry = readFileSync(path.join(assetsDir, entryName), 'utf8');
    assert.doesNotMatch(entry, /Personal borrowing and intended use/);
    assert.doesNotMatch(entry, /Who decides whether an application is approved\?/);

    const deferredContentChunk = scripts
      .filter((name) => name !== entryName)
      .find((name) => /Personal borrowing and intended use/.test(readFileSync(path.join(assetsDir, name), 'utf8')));
    assert.ok(deferredContentChunk, 'loan editorial content is emitted in a deferred JavaScript chunk');
  });
});
