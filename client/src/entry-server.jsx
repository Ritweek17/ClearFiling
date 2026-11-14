import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { renderToString } from 'react-dom/server';
import { Writable } from 'node:stream';
import AppRoutes from './AppRoutes.jsx';
import NotFound from './pages/NotFound.jsx';

export function render(url) {
  return new Promise((resolve, reject) => {
    let markup = '';
    const errors = [];
    let completed = false;
    const timeout = setTimeout(() => {
      stream.abort();
      reject(new Error(`React server rendering timed out for ${url}`));
    }, 30000);
    timeout.unref?.();

    const stream = renderToPipeableStream(
      <React.StrictMode>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </React.StrictMode>,
      {
        onAllReady() {
          const output = new Writable({
            write(chunk, encoding, callback) {
              markup += chunk.toString();
              callback();
            },
          });
          output.on('finish', () => {
            completed = true;
            clearTimeout(timeout);
            if (errors.length) {
              reject(new AggregateError(errors, `React server rendering failed for ${url}`));
            } else {
              resolve(markup);
            }
          });
          stream.pipe(output);
        },
        onShellError(error) {
          if (!completed) {
            clearTimeout(timeout);
            reject(error);
          }
        },
        onError(error) {
          errors.push(error);
        },
      },
    );

  });
}

export function renderNotFound() {
  return renderToString(
    <StaticRouter location="/">
      <NotFound />
    </StaticRouter>,
  );
}
