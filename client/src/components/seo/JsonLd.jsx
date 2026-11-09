import { useEffect } from 'react';

/**
 * JsonLd component dynamically injects JSON-LD structured schemas into the document head on mount,
 * and cleans them up on unmount to support dynamic SEO configurations.
 * Prevents duplicate ID collisions by managing the DOM node directly.
 */
const JsonLd = ({ schema, id }) => {
  useEffect(() => {
    if (!schema) return;

    // Create the script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const schemaType = schema['@type'] ? String(schema['@type']).toLowerCase() : 'schema';
    script.dataset.schema = schemaType;
    if (id) {
      script.id = id;
    }
    // Defensively escape '<' to prevent script-tag breakouts and assign via textContent
    script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c');
    
    // Append to head
    document.head.appendChild(script);

    // Cleanup script on unmount using direct element reference
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [schema, id]);

  return null;
};

export default JsonLd;
