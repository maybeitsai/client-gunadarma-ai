import type { ComponentPropsWithoutRef } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const mdComponents: Components = {
  p: ({ children }) => (
    <p className="text-sm leading-relaxed text-text-primary [&:not(:last-child)]:mb-3">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
  em: ({ children }) => <em className="italic text-text-secondary">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-3 list-disc space-y-1.5 pl-6 text-sm text-text-primary">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 list-decimal space-y-1.5 pl-6 text-sm text-text-primary">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: (props) => {
    const isInline = 'inline' in props && Boolean((props as { inline?: boolean }).inline)
    const { children } = props

    if (isInline) {
      return (
        <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-xs text-primary">
          {children}
        </code>
      )
    }

    return (
      <code className="block overflow-x-auto rounded-xl bg-surface p-4 font-mono text-xs leading-relaxed text-text-primary">
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }) => (
    <pre
      {...(props as ComponentPropsWithoutRef<'pre'>)}
      className="my-4 overflow-x-auto rounded-xl bg-surface p-4 font-mono text-xs leading-relaxed text-text-primary"
    >
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary/40 pl-4 italic text-text-secondary">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-dashed border-border" />,
}

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => (
  <div className="space-y-4 text-sm leading-relaxed">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {content}
    </ReactMarkdown>
  </div>
)

export { MarkdownRenderer }
