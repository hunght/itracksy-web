import 'github-markdown-css';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BsClipboard } from 'react-icons/bs';
import ReactMarkdown from 'react-markdown';
import reactNodeToString from 'react-node-to-string';
import rehypeHighlight from 'rehype-highlight';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import supersub from 'remark-supersub';

import './markdown.css';
import { cn } from '@/lib/utils';

function CustomCode(props: { children: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);

  const code = useMemo(
    () => reactNodeToString(props.children),
    [props.children]
  );

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000);
    }
  }, [copied]);

  return (
    <div className="flex flex-col">
      <div className="bg-[#e6e7e8] dark:bg-[#444a5354] text-xs p-2">
        <CopyToClipboard text={code} onCopy={() => setCopied(true)}>
          <div className="flex flex-row items-center gap-2 cursor-pointer w-fit ml-1">
            <BsClipboard />
            <span>{copied ? 'copied' : 'copy code'}</span>
          </div>
        </CopyToClipboard>
      </div>
      <code className={cn(props.className, 'px-4')}>{props.children}</code>
    </div>
  );
}

export const Markdown: FC<{ children: string | null }> = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, supersub, remarkBreaks, remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      className={`markdown-body markdown-custom-styles !text-base font-normal !bg-transparent`}
      components={{
        a: ({ node, ...props }) => {
          if (!props.title) {
            return <a {...props} />;
          }
          return <a {...props} title={props.title} />;
        },
        code: ({ node, className, children, ...props }) => {
          return <CustomCode className={className}>{children}</CustomCode>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
