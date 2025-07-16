export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh max-h-dvh min-h-screen flex-col">
      <header className="flex h-16 items-center border-b pl-6">
        <h1 className="text-xl font-semibold">Logs Dashboard</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
