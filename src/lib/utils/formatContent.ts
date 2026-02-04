/**
 * Format article content to properly display spaces and newlines
 * Converts plain text newlines to HTML line breaks and preserves spacing
 * Double newlines become paragraph breaks
 */
export function formatArticleContent(content: string): string {
  if (!content) return '';

  // If content already contains HTML tags (p, br, div, etc), just return as-is
  if (/<[^>]+>/.test(content)) {
    return content;
  }

  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs
    .map(paragraph => {
      // Within each paragraph, convert single newlines to <br /> and preserve spaces
      const lines = paragraph.split('\n');
      const formattedLines = lines.map(line => {
        // Preserve leading spaces by converting them to non-breaking spaces
        const leadingSpaces = line.match(/^ */)?.[0].length || 0;
        const trimmedLine = line.trimStart();
        const nbsp = leadingSpaces > 0 ? '&nbsp;'.repeat(leadingSpaces) : '';
        // Preserve multiple spaces within the line
        const lineWithSpaces = (nbsp + trimmedLine).replace(/  +/g, match => '&nbsp;'.repeat(match.length));
        return lineWithSpaces;
      }).join('<br />');
      
      // Wrap in paragraph tags if there's content
      return formattedLines.trim() ? `<p>${formattedLines}</p>` : '';
    })
    .filter(Boolean)
    .join('');
}

/**
 * Sanitize HTML content while preserving formatting
 */
export function sanitizeContent(html: string): string {
  // Remove dangerous attributes and scripts
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
}

/**
 * Ensure proper HTML structure with paragraph tags
 */
export function wrapInParagraphs(text: string): string {
  if (/<[^>]+>/.test(text)) {
    return text; // Already has HTML
  }

  return text
    .split('\n\n')
    .filter(para => para.trim())
    .map(para => `<p>${para.replace(/\n/g, '<br />')}</p>`)
    .join('');
}
