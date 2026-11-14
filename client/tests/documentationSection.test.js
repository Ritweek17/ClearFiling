import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientRoot = path.resolve(__dirname, '..');

describe('DocumentationSection component SSR & design-preservation smoke test', () => {
  it('bundles with esbuild and renders preserved section structure, search, tabs, and loading skeleton without crashing', async () => {
    const outFile = path.join(__dirname, `.tmp-doc-section-${Date.now()}.mjs`);

    try {
      await esbuild.build({
        entryPoints: [path.join(clientRoot, 'src/components/features/DocumentationSection.jsx')],
        bundle: true,
        format: 'esm',
        platform: 'node',
        jsx: 'automatic',
        packages: 'external',
        outfile: outFile,
        define: {
          'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://api.clearfiling.co.in'),
          'import.meta.env.PROD': 'true',
          'import.meta.env.DEV': 'false',
        },
      });

      const mod = await import(pathToFileURL(outFile).href);
      const DocumentationSection = mod.default;
      assert.equal(typeof DocumentationSection, 'function');

      const html = renderToStaticMarkup(React.createElement(DocumentationSection));

      // Preserved section heading & landmark
      assert.match(html, /id="documentation"/);
      assert.match(html, /RESOURCES &amp; DRAFTS/);
      assert.match(html, />Documentation</);
      assert.match(html, /Search and access important business documents/);

      // Preserved search bar with accessible label & maxLength guard
      assert.match(html, /aria-label="Search documents"/);
      assert.match(html, /maxlength="100"/i);

      // Preserved category tablist with 'All Documents' default tab
      assert.match(html, /role="tablist"/);
      assert.match(html, /All Documents/);

      // Renders skeleton placeholders cleanly while loading without exposing raw errors
      assert.match(html, /role="status"/);
      assert.match(html, /Loading documents\.\.\./);
      assert.doesNotMatch(html, /MongoServerError|stack|localhost:5001/);
    } finally {
      rmSync(outFile, { force: true });
    }
  });
});
