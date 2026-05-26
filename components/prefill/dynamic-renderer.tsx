import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Field } from "../ui/field";
import { AvantosType } from "@/types";
import { X as CloseIcon, Database } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type DynamicRendererProps = {
  type: AvantosType;
  title: string;
  format?: "email";
  inherited?: boolean;
  inheritFrom?: string;
  onChange?: () => void;
  onReset?: () => void;
};

export default function DynamicRenderer(props: DynamicRendererProps) {
  const title = props.title?.toLowerCase().replace(/\s/g, "_");
  let content = `${props.format === "email" ? "email: " : `${title}:`} ${props.inheritFrom ?? "Form A"}.${title}`;
  switch (props.type) {
    case "short-text":
      if (!props.inherited) content = title;
      if (!props.format) return null; // TODO: Only support email for now

      return (
        <div className="flex items-center gap-1 p-2  rounded-full bg-zinc-50">
          <div
            className={cn("w-full h-5 text-zinc-500/80 pl-2 cursor-pointer", {
              "text-zinc-500!": props.inherited,
            })}
            onClick={props.onChange}
          >
            {content}
          </div>

          {props.inherited && (
            <Button
              className="p-1 w-7 aspect-square bg-zinc-500 text-white rounded-full"
              onClick={props.onReset}
            >
              <CloseIcon className="size-5 text-white" />
            </Button>
          )}
        </div>
      );

    case "object-enum":
      if (!props.inherited) content = "object_object";
      return (
        <div className="flex items-center gap-2 p-2 border-[1.5px] border-dashed! border-zinc-200 rounded-sm bg-zinc-50">
          <Database className="size-5 text-zinc-500" />
          <div
            className={cn("w-full text-zinc-500/80 cursor-pointer", {
              "text-zinc-500!": props.inherited,
            })}
            onClick={props.onChange}
          >
            {content}
          </div>
        </div>
      );

    case "checkbox-group":
      if (!props.inherited) content = "dynamic_checkbox_group";
      return (
        <div className="flex items-center gap-2 p-2 border-[1.5px] border-dashed! border-blue-200 rounded-sm bg-blue-50/50">
          <Database className="size-5 text-zinc-500" />
          <div
            className={cn("w-full text-zinc-500/80 cursor-pointer", {
              "text-zinc-500!": props.inherited,
            })}
            onClick={props.onChange}
          >
            {content}
          </div>
        </div>
      );

    default:
      // console.warn(`TODO: implement unsupported type: ${props.type}`);
      return null;
  }
}
