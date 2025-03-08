import { remark } from 'remark';
import strip from 'strip-markdown';

export function markdownToPlainText(markdown: string): string {
  let plainText = '';
  remark()
    .use(strip)
    .process(markdown, (err, file) => {
      if (err) throw err;
      plainText = String(file);
    });

  // Remove links
  plainText = plainText.replace(/https?:\/\/\S+/g, '');

  // Trim whitespace and limit to 200 characters
  return plainText.trim().substring(0, 200);
}
