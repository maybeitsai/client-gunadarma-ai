const ChatPage = (): JSX.Element => (
  <main className="min-h-screen bg-background text-foreground">
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Chat workspace
        </p>
        <h1 className="text-3xl font-semibold">AI Assistant Console</h1>
        <p className="text-base text-muted-foreground">
          Feature modules will be wired here once chat and document flows are implemented.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="text-muted-foreground">
          The UI is intentionally left minimal until feature components are introduced.
        </p>
      </section>
    </div>
  </main>
)

export default ChatPage
