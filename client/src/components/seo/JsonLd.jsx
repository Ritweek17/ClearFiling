import React from 'react';

const stableSchemaId = (schema, explicitId) => {
  if (explicitId) return explicitId;
  if (schema?.['@id']) return `clearfiling-schema-${String(schema['@id']).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  const serialized = JSON.stringify(schema);
  let hash = 2166136261;
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `clearfiling-schema-${(Array.isArray(schema?.['@type']) ? schema['@type'].join('-') : schema?.['@type'] || 'schema').toLowerCase()}-${(hash >>> 0).toString(36)}`;
};

/** Render structured data as React markup so it exists in static HTML and hydrates once. */
const JsonLd = ({ schema, id }) => {
  if (!schema) return null;

  const schemaType = schema['@type']
    ? (Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']]).join(',').toLowerCase()
    : 'schema';

  return (
    <script
      id={stableSchemaId(schema, id)}
      type="application/ld+json"
      data-schema={schemaType}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
};

export default JsonLd;
