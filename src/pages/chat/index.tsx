const ChatPage = () => (
  <section className="flex flex-col gap-8">
    <header className="space-y-4">
      <div className="space-y-1">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.2em]">
          Chat workspace
        </p>
        <h1 className="text-display-sm text-text-primary font-semibold">AI Assistant Console</h1>
      </div>
      <p className="text-text-secondary max-w-2xl text-base">
        Conversational flows, streaming responses, and document-aware context builders will mount
        here. The current view focuses on design tokens, spacing rhythm, and theming foundations.
      </p>
    </header>

    <article className="surface-panel flex flex-col gap-4">
      <div>
        <p className="text-text-secondary text-sm font-semibold">Status</p>
        <p className="text-text-primary text-2xl font-semibold">Foundations ready</p>
      </div>
      <p className="text-text-muted text-sm">
        Chat modules, agent routing, and document orchestration hooks will connect into this surface
        once business logic is introduced. Until then, the shell ensures typography, elevation, and
        motion tokens remain consistent across feature boundaries.
      </p>
    </article>
  </section>
)

export default ChatPage
