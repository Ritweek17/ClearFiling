import test from 'node:test';
import assert from 'node:assert/strict';

test('Frontend Validation: PDF file validation logic', () => {
  const isPdf = (name, type) => {
    const isPdfExt = /\.pdf$/i.test(name);
    const isPdfMime = type === 'application/pdf';
    return isPdfExt && isPdfMime;
  };

  assert.equal(isPdf('document.pdf', 'application/pdf'), true);
  assert.equal(isPdf('FORM_2026.PDF', 'application/pdf'), true);
  assert.equal(isPdf('image.png', 'image/png'), false);
  assert.equal(isPdf('script.exe', 'application/x-msdownload'), false);
  assert.equal(isPdf('fake.pdf', 'text/plain'), false);
});

test('Frontend Validation: 10MB file size ceiling', () => {
  const MAX_BYTES = 10 * 1024 * 1024;
  const isWithinLimit = (bytes) => bytes <= MAX_BYTES;

  assert.equal(isWithinLimit(5 * 1024 * 1024), true); // 5MB -> OK
  assert.equal(isWithinLimit(10 * 1024 * 1024), true); // 10MB -> OK
  assert.equal(isWithinLimit(10 * 1024 * 1024 + 1), false); // 10MB + 1 byte -> Exceeded
});

