import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * GET endpoint to fetch blueprint graph data
 * Reads from graph.json file in the app/api/v1 directory
 */
export async function GET(_req: Request) {
  try {
    const filePath = join(process.cwd(), 'server/graph.json');

    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const res = {
      data,
      success: true,
      error: null,
      message: 'Graph data fetched successfully',
    };

    return Response.json(res, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('Failed to fetch graph data:', error);

    const res = {
      data: null,
      success: false,
      error: error,
      message: 'Failed to fetch graph data',
    };

    return Response.json(res, {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
