'use client';
import { useState } from 'react';
import Flow from './flow';
import { Edge, FormNodeType } from './form-node';
import { useFetch } from '@/hooks/use-fetch';
import { AlertCircle, RotateCcw, Loader2 } from 'lucide-react';

const BLUEPRINT_ID = process.env.NEXT_PUBLIC_BLUEPRINT_ID || 'blueprint456';
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'project123';

interface GraphData {
  nodes: FormNodeType[];
  edges: Edge[];
  forms: [];
}

/**
 * GraphContent component that fetches and displays graph data with retry logic
 * Handles loading, error, and empty states gracefully
 */
export default function GraphContent() {
  const url = `/api/v1/${PROJECT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph`;

  const { data: graphData, loading, error, retry } = useFetch<GraphData>(url);

  const [userRetrying, setUserRetrying] = useState(false);

  const handleRetry = () => {
    setUserRetrying(true);
    retry();
    setTimeout(() => setUserRetrying(false), 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center border border-zinc-200 rounded-lg dark:border-zinc-800 bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            id="loader-icon"
            className="h-8 w-8 animate-spin text-zinc-600 dark:text-zinc-300"
          />
          <p className="text-zinc-600 dark:text-zinc-300">Loading blueprint...</p>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center border border-red-200 rounded-lg dark:border-red-900 bg-red-50 dark:bg-red-950/30">
        <div className="flex flex-col items-center gap-4 px-4">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          <div className="text-center">
            <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
              Failed to load blueprint
            </p>
            <p className="text-xs text-red-700 dark:text-red-300 mb-4">{error.message}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleRetry}
                disabled={userRetrying}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <RotateCcw className={`h-4 w-4 ${userRetrying ? 'animate-spin' : ''}`} />
                {userRetrying ? 'Retrying...' : 'Retry'}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!graphData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center border border-yellow-200 rounded-lg dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/30">
        <div className="flex flex-col items-center gap-4 px-4">
          <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          <div className="text-center">
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
              No blueprint data
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-4">
              The blueprint data is empty. Please check your configuration.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="h-screen w-screen scale-95">
      <Flow data={graphData} />
    </div>
  );
}
