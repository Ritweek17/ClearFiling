import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient } from '../src/api/apiClient.js';

test('Frontend API Client: withCredentials is enabled for HttpOnly session cookies', () => {
  assert.equal(apiClient.defaults.withCredentials, true);
});

test('Frontend API Client: attaches anti-CSRF custom header', () => {
  assert.equal(apiClient.defaults.headers['X-Requested-With'], 'XMLHttpRequest');
});

test('Frontend API Client: defaults to configured base URL or localhost:5000', () => {
  assert.ok(apiClient.defaults.baseURL);
  assert.match(apiClient.defaults.baseURL, /http/);
});

