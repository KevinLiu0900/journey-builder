'use client';

import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  type Node,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import FormNode, { Edge, FormNodeType } from '@/components/flows/form-node';
import { useFormNode } from '@/app/context';
import { Dialog } from '../ui/dialog';
import { PrefillDialog } from '../prefill';
import { useCallback, useEffect } from 'react';

const nodeTypes: NodeTypes = {
  formNodeType: FormNode,
};

type FlowProps = {
  data: {
    nodes: FormNodeType[];
    edges: Edge[];
    forms: [];
  };
};

function drawEdge(source: FormNodeType, target: FormNodeType) {
  return {
    id: `e${source.id}-${target.id}`,
    source: source.id,
    sourceHandle: 'a',
    target: target.id,
    targetHandle: 'c',
  };
}

function drawNodes(nodes: FormNodeType[], onClick?: (node: FormNodeType) => void) {
  const reactFlowNodes: Node[] = [];

  for (const node of nodes) {
    if (node.data.prerequisites.length === 0) {
      reactFlowNodes.unshift({
        id: node.id,
        type: 'formNodeType',
        data: {
          ...node.data,
          onClick: () => onClick?.(node),
        },
        position: node.position,
      });

      continue;
    }

    reactFlowNodes.push({
      id: node.id,
      type: 'formNodeType',
      data: {
        ...node.data,
        onClick: () => onClick?.(node),
      },
      position: node.position,
    });
  }

  return reactFlowNodes;
}

function dependencyMap(nodeMap: Record<string, FormNodeType>) {
  const nodes = Object.values(nodeMap);
  const map: Record<string, Record<string, FormNodeType>> = {};

  for (const node of nodes) {
    const prequisiteNodes: string[] = node.data.prerequisites;

    const preqMap: Record<string, FormNodeType> = {};
    for (const preqId of prequisiteNodes) {
      if (nodeMap?.[preqId]) {
        preqMap[preqId] = nodeMap?.[preqId];
      }
    }

    map[node.id] = preqMap;
  }

  return map;
}

function traverseNode(nodes: FormNodeType[], edges: Edge[] = []) {
  const _edges = [];

  const nodeMap: Record<string, FormNodeType> = {};

  for (const node of nodes) {
    nodeMap[node.id] = node;
  }

  // draw edges
  for (const edge of edges) {
    const sourceNode = nodeMap[edge.source];
    const targetNode = nodeMap[edge.target];

    if (sourceNode && targetNode) {
      _edges.push(drawEdge(sourceNode, targetNode));
    }
  }

  return { nodeMap, edges: _edges };
}

function Flow(props: FlowProps) {
  const { handleNodeClick, updateDependencies, resetForm } = useFormNode();
  const _nodes = drawNodes(props.data.nodes, handleNodeClick);

  // TODO: Refactor to avoid traversing the nodes on every render
  const traverseResult = traverseNode(props.data.nodes, props.data.edges);
  // @ts-ignore-next-line
  const [nodes, _setNodes, onNodesChange] = useNodesState(_nodes || []);
  // @ts-ignore-next-line
  const [edges, _setEdges, onEdgesChange] = useEdgesState(traverseResult.edges || []);

  const resetSelectionOnClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
  };

  const updateDependenciesCallback = useCallback(() => {
    if (Object.keys(traverseResult.nodeMap).length > 0) {
      updateDependencies(dependencyMap(traverseResult.nodeMap));
    }
  }, [traverseResult.nodeMap, updateDependencies]);

  useEffect(() => {
    updateDependenciesCallback();
  }, [updateDependenciesCallback]);

  return (
    <Dialog onOpenChange={resetSelectionOnClose}>
      <ReactFlow
        {...props}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        minZoom={0.2}
        maxZoom={0.75}
        zoomOnPinch={true}
        defaultChecked={true}
      >
        <Controls />
        <Background />
      </ReactFlow>

      <PrefillDialog forms={props.data.forms} nodeMap={traverseResult.nodeMap} />
    </Dialog>
  );
}

export default Flow;
