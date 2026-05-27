import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Form } from "lucide-react";
import { Button } from "../ui/button";
import { DialogTrigger } from "../ui/dialog";

interface SlaDuration {
  number: number;
  unit: string;
}

export type FormNodeData = {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  input_mapping: Record<string, string>;
  sla_duration: SlaDuration;
  approval_required: boolean;
  approval_roles: string[];
};

type FormNode = Node<FormNodeData & { onClick?: () => void }, "counter">;
export type FormNodeProps = NodeProps<FormNode>;
export type FormNodeType = {
  id: string;
  position: { x: number; y: number };
  type: string;
  data: FormNodeData;
};

export type Edge = {
  source: string;
  target: string;
};

export default function FormNode(props: FormNodeProps) {
  const name = props.data.name || "Form";
  return (
    <DialogTrigger asChild>
      <Button
        onClick={props.data.onClick}
        key={props.id}
        className="flex items-center gap-2 p-2 border border-zinc-300  rounded bg-white"
      >
        <div className="">
          <div className="rounded-md text-white bg-purple-700 p-2">
            <Form className="w-8 h-8" fill="currentColor" />
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-0">
          <span className="text-sm text-black/40 font-bold font-sans">
            Form
          </span>
          <span className="block text-base text-black/60 font-extrabold">
            {name}
          </span>
        </div>

        <Handle type="source" position={Position.Right} id={"a"} />
        <Handle type="source" position={Position.Left} id={"b"} />
        <Handle type="target" position={Position.Left} id={"c"} />
        <Handle type="target" position={Position.Right} id={"d"} />
      </Button>
    </DialogTrigger>
  );
}
