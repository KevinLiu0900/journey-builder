import fs from 'fs/promises';
import path from 'path';

/**
 * GET endpoint to fetch blueprint graph data
 * Reads from graph.json file in the app/api/v1 directory
 */
export async function GET(_req: Request) {
  try {
    const filePath = path.join(process.cwd(), 'server/graph.json');

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return Response.json(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('Failed to fetch graph data:', error);

    return Response.json({ error: 'Failed to load graph data' }, { status: 404 });
  }
}
