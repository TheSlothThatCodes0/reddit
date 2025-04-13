/**
 * Helper utility to safely extract text content from various post content formats
 */
export function extractPostContent(content: any): string {
  // If content is null or undefined
  if (!content) return '';
  
  // Log what we're trying to parse
  console.log('Extracting content from:', content);
  
  // If content is already a string
  if (typeof content === 'string') {
    try {
      // Check if it's a JSON string
      const parsed = JSON.parse(content);
      return parsed.text || JSON.stringify(parsed);
    } catch {
      // It's just a regular string
      return content;
    }
  }
  
  // If content is an object
  if (typeof content === 'object') {
    if (content.text) return content.text;
    if (content.blocks) {
      try {
        return content.blocks.map((block: any) => block.text).join('\n');
      } catch {
        return JSON.stringify(content);
      }
    }
    
    // Fallback for other object structures
    return JSON.stringify(content);
  }
  
  // Last resort
  return String(content);
}
