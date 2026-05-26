import Flow from "@/components/flows/flow";

export default async function Home() {
  const response = await fetch(
    "http://localhost:3000/api/v1/project123/actions/blueprints/blueprint456/graph",
  );
  const data = await response.json();

  return (
    <div className="flex flex-col flex-1 items-center justify-center  font-sans dark:bg-black">
      <main className="text-3xl bg-zinc-50 min-h-screen">
        <section className="h-screen w-screen border-2 border-zinc-50 rounded-lg">
          <Flow data={data} />
        </section>
      </main>
    </div>
  );
}
