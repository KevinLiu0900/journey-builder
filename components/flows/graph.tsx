import Flow from "./flow";
import { Edge, FormNodeType } from "./form-node";

const API_BASE_URL = process.env.NEXT_APP_URL || "http://localhost:3000";
const BLUEPRINT_ID = process.env.NEXT_PUBLIC_BLUEPRINT_ID || "blueprint456";
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || "project123";

interface GraphData {
  nodes: FormNodeType[];
  edges: Edge[];
  forms: [];
}

/**
 * Fetch graph data from the server-side API
 * Runs on the server before component renders
 */
async function fetchGraphData(): Promise<GraphData | null> {
  try {
    const url = `${API_BASE_URL}/api/v1/${PROJECT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!response.ok) {
      console.error(
        "API request failed:",
        response.status,
        response.statusText,
      );
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch graph data:", error);
    return null;
  }
}

/**
 * Server component that fetches and renders graph data
 * Data fetching happens server-side during render
 */
export default async function GraphContent() {
  const graphData = await fetchGraphData();

  if (!graphData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center border border-zinc-200 rounded-lg dark:border-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-400">
          Failed to load graph data. Kindly refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen border border-zinc-200 rounded-lg dark:border-zinc-800">
      <Flow data={graphData} />
    </div>
  );
}
