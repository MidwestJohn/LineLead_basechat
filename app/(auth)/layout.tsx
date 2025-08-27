import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <Link href="/" className="inline-flex items-center">
            <Image src="/line-lead.svg" alt="Line Lead" width={120} height={24} priority />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="w-full max-w-[442px] mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 py-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-6 py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Line Lead. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
