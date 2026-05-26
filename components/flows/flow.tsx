"use client";

import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  type Node,
} from "@xyflow/react";

// @ts-ignore
import "@xyflow/react/dist/style.css";

import FormNode, {
  Edge,
  FormNodeProps,
  FormNodeType,
} from "@/components/flows/form-node";
import { useFormNode } from "@/app/context";
import { Dialog } from "../ui/dialog";
import { PrefillDialog } from "../prefill";
import { useEffect } from "react";

const nodeTypes: NodeTypes = {
  formNodeType: FormNode,
};
const initialNodes: Node[] = [
  {
    id: "form-a",
    type: "formNodeType",
    data: { name: "Form A", onClick: () => alert("Form A clicked") },
    position: { x: 100, y: 250 },
  },
  {
    id: "form-b",
    type: "formNodeType",
    data: { name: "Form B", onClick: () => alert("Form B clicked") },
    position: { x: 300, y: 150 },
  },
  {
    id: "form-c",
    type: "formNodeType",
    data: { name: "Form C", onClick: () => alert("Form C clicked") },
    position: { x: 300, y: 350 },
  },
  {
    id: "form-d",
    type: "formNodeType",
    data: { name: "Form D", onClick: () => alert("Form D clicked") },
    position: { x: 500, y: 150 },
  },
  {
    id: "form-e",
    type: "formNodeType",
    data: { name: "Form E", onClick: () => alert("Form E clicked") },
    position: { x: 500, y: 350 },
  },
];

const initialEdges = [
  {
    id: "ea-b",
    source: "form-a",
    sourceHandle: "a",
    target: "form-b",
    targetHandle: "c",
  },
  {
    id: "ea-c",
    source: "form-a",
    sourceHandle: "a",
    target: "form-c",
    targetHandle: "c",
  },
  {
    id: "eb-d",
    source: "form-b",
    sourceHandle: "a",
    target: "form-d",
    targetHandle: "c",
  },
  {
    id: "ec-e",
    source: "form-c",
    sourceHandle: "a",
    target: "form-e",
    targetHandle: "c",
  },
];

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
    sourceHandle: "a",
    target: target.id,
    targetHandle: "c",
  };
}

function drawNodes(
  nodes: FormNodeType[],
  onClick?: (node: FormNodeType) => void,
) {
  const reactFlowNodes: Node[] = [];

  for (const node of nodes) {
    if (node.data.prerequisites.length === 0) {
      reactFlowNodes.unshift({
        id: node.id,
        type: "formNodeType",
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
      type: "formNodeType",
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
  const { handleNodeClick, updateDependencies } = useFormNode();
  const _nodes = drawNodes(props.data.nodes, handleNodeClick);

  // TODO: Refactor to avoid traversing the nodes on every render
  const traverseResult = traverseNode(props.data.nodes, props.data.edges);
  const [nodes, _setNodes, onNodesChange] = useNodesState(
    _nodes || initialNodes,
  );
  const [edges, _setEdges, onEdgesChange] = useEdgesState(
    traverseResult.edges || initialEdges,
  );

  const resetSelectionOnClose = (open: boolean) => {
    if (!open) {
      handleNodeClick(null);
    }
  };

  useEffect(() => {
    if (Object.keys(traverseResult.nodeMap).length > 0) {
      updateDependencies(dependencyMap(traverseResult.nodeMap));
    }
  }, []);

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

      <PrefillDialog
        forms={props.data.forms}
        nodeMap={traverseResult.nodeMap}
      />
    </Dialog>
  );
}

export default Flow;
