export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-0 flex h-screen flex-col overflow-hidden bg-zinc-900">
      <header className="flex h-16 items-center border-b pl-6">
        <h1 className="text-xl font-bold">📮 Logs Dashboard</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
