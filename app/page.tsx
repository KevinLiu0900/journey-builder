import { GraphContent } from "@/components/flows";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <section className="w-full max-w-7xl px-4">
        <Suspense
          fallback={
            <div className="text-center text-zinc-500">
              Loading blueprint...
            </div>
          }
        >
          <GraphContent />
        </Suspense>
      </section>
    </main>
  );
}
