import type { ComponentPropsWithoutRef } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const mdComponents: Components = {
  p: ({ children }) => (
    <p className="text-text-primary text-sm leading-relaxed [&:not(:last-child)]:mb-4">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="hover:text-primary-hover font-semibold text-primary underline-offset-4 hover:underline"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="text-text-primary font-semibold">{children}</strong>,
  em: ({ children }) => <em className="text-text-secondary">{children}</em>,
  ul: ({ children }) => (
    <ul className="text-text-primary list-disc space-y-2 pl-6 text-sm">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-text-primary list-decimal space-y-2 pl-6 text-sm">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-surface rounded-md px-1.5 py-px text-xs text-primary">{children}</code>
    ) : (
      <code className="bg-surface text-text-primary block rounded-xl p-4 text-xs">{children}</code>
    ),
  pre: ({ children, ...props }) => (
    <pre
      {...(props as ComponentPropsWithoutRef<'pre'>)}
      className="bg-surface text-text-primary rounded-xl p-4 text-xs"
    >
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="text-text-secondary border-l-4 border-primary/40 pl-4 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-dashed border-border" />,
}

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => (
  <ReactMarkdown
    className="space-y-4 text-sm leading-relaxed"
    remarkPlugins={[remarkGfm]}
    components={mdComponents}
  >
    {content}
  </ReactMarkdown>
)

export { MarkdownRenderer }
