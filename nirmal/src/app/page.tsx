export default function Home() {
  return (
    <main className="min-h-[calc(100vh-88px)] w-full flex items-center justify-center p-6 sm:p-10">
      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Welcome to NIRMAL</h1>
          <p className="text-base sm:text-lg text-foreground/80">
            A citizen-first platform for zero-waste cities. Choose your role to get started.
          </p>
          <ul className="text-sm sm:text-base list-disc pl-5 text-foreground/70">
            <li>Fast, lightweight, multilingual experience</li>
            <li>Inclusive and accessible by design</li>
            <li>Privacy-first with transparent consent</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/citizen" className="group rounded-xl border border-foreground/15 p-5 sm:p-6 hover:bg-foreground/5 transition focus:outline-none focus:ring-2 focus:ring-foreground/30" aria-label="Citizen">
            <div className="text-xl font-semibold">Citizen</div>
            <p className="text-sm text-foreground/70 mt-2">Training, certification, compost logs, services, rewards.</p>
          </a>
          <a href="/worker" className="group rounded-xl border border-foreground/15 p-5 sm:p-6 hover:bg-foreground/5 transition focus:outline-none focus:ring-2 focus:ring-foreground/30" aria-label="Worker">
            <div className="text-xl font-semibold">Worker</div>
            <p className="text-sm text-foreground/70 mt-2">Routes, tasks, proof uploads, facility access, PPE.</p>
          </a>
          <a href="/admin" className="group rounded-xl border border-foreground/15 p-5 sm:p-6 hover:bg-foreground/5 transition focus:outline-none focus:ring-2 focus:ring-foreground/30" aria-label="Admin">
            <div className="text-xl font-semibold">Admin</div>
            <p className="text-sm text-foreground/70 mt-2">Live monitoring, enforcement, stock & distribution.</p>
          </a>
        </div>
      </section>
    </main>
  );
}
