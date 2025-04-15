import { markdown } from 'markdown';
import { sanitize } from 'isomorphic-dompurify';
import { classnames } from '@/utils/classnames/classnames';
import { MarkdownProps } from './types';

const Markdown = ({ children, className }: MarkdownProps) => {
  const html = markdown.toHTML(children ?? '');

  const dangerousHtml = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, "'");

  const sanitizedHtml = sanitize(dangerousHtml, { ADD_TAGS: ['iframe'] });

  return (
    <p className={classnames('whitespace-pre-wrap', className)} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
  );
};

export default Markdown;
