import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Select a Page
        </h1>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <Link
              key={n}
              href={`/${n}`}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-lg font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              {n}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
