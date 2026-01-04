import { marked } from 'marked';

export const markdownToHtml = async (markdown: string): Promise<string> => {
  // Use a simple custom renderer or pre-processor to preserve LaTeX
  // Strategy:
  // 1. Replace $$...$$ with <latex-block>...</latex-block>
  // 2. Replace $...$ with <latex-inline>...</latex-inline>
  // 3. Run marked
  // 4. Return HTML

  // Note: We need to be careful about matching.
  // Using placeholders is safer to avoid markdown messing up the latex.
  // We avoid underscores at start/end to prevent markdown from interpreting them as emphasis.

  const placeholders: { id: string, text: string }[] = [];

  // Replace block math $$...$$
  let processed = markdown.replace(/\$\$([\s\S]+?)\$\$/g, (match, p1) => {
      const id = `MATHBLOCKPLACEHOLDER${placeholders.length}END`;
      placeholders.push({ id, text: `<latex-block>${p1}</latex-block>` });
      return id;
  });

  // Replace inline math $...$
  // Avoid matching across lines for inline, and ensure we don't match empty $$.
  // Regex: $ followed by not $, then content, then $
  processed = processed.replace(/\$([^$\n]+?)\$/g, (match, p1) => {
      const id = `MATHINLINEPLACEHOLDER${placeholders.length}END`;
      placeholders.push({ id, text: `<latex-inline>${p1}</latex-inline>` });
      return id;
  });

  const htmlPromise = marked(processed);
  let html = await htmlPromise;

  // Restore placeholders
  placeholders.forEach(p => {
      // replace all occurrences just in case, though distinct IDs should prevent duplicates
      html = html.replace(new RegExp(p.id, 'g'), p.text);
  });

  return html;
};
