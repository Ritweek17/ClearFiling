import { useEffect } from 'react';

/**
 * JsonLd component dynamically injects JSON-LD structured schemas into the document head on mount,
 * and cleans them up on unmount to support dynamic SEO configurations.
 */
const JsonLd = ({ schema }) => {
  useEffect(() => {
    if (!schema) return;

    // Create the script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'json-ld-schema';
    script.innerHTML = JSON.stringify(schema);
    
    // Append to head
    document.head.appendChild(script);

    // Cleanup script on unmount
    return () => {
      const existingScript = document.getElementById('json-ld-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [schema]);

  return null;
};

export default JsonLd;
