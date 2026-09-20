import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* Header */}
        <header className="border-b border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">
              Dev Playground
            </Link>

            <nav className="flex gap-6 text-sm text-zinc-400">
              <Link href="/components" className="hover:text-white">
                Components
              </Link>
              <Link href="/hooks" className="hover:text-white">
                Hooks
              </Link>
              <Link href="/utils" className="hover:text-white">
                Utils
              </Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 mt-20">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500">
            Built with Next.js & Tailwind
          </div>
        </footer>
      </body>
    </html>
  );
}
