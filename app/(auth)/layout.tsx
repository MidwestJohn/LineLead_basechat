import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="w-full border-b">
        <div className="mx-auto flex h-14 max-w-[1140px] items-center px-4">
          <Image src="/linelead-wordmark.svg" alt="Line Lead" width={140} height={28} className="h-7 w-auto" priority />
        </div>
      </header>

      <main className="mx-auto max-w-[1140px] px-4 py-8">
        <div className="w-full max-w-[442px] mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          {children}
        </div>
      </main>

      <footer className="border-t">
        <div className={`mx-auto max-w-[1140px] px-4 py-6 text-sm text-muted-foreground ${inter.className}`}>
          © {new Date().getFullYear()} Line Lead. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
