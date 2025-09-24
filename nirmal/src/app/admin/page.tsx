export default function AdminHome() {
  return (
    <main className="p-6 sm:p-10 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-foreground/80">Live monitoring, enforcement, stock and distribution placeholders.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-40 rounded border border-foreground/15" aria-label="Map placeholder" />
        <div className="h-40 rounded border border-foreground/15" aria-label="Chart placeholder" />
        <div className="h-40 rounded border border-foreground/15" aria-label="Alerts placeholder" />
      </div>
    </main>
  );
}

