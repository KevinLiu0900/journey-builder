"use client";

import {
  useCurrentForm,
  useCurrentNode,
  useFormNode,
  useSelectedFieldContext,
} from "@/app/context";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Switch } from "../ui/switch";
import { useMemo, useState } from "react";
import DynamicRenderer from "./dynamic-renderer";
import { AvantosType, FormProperties, FormType } from "@/types";
import { AppSidebar } from "../sidebar";
import { FormNodeType } from "../flows/form-node";
import { toast } from "sonner";

type PrefillDialogProps = {
  forms: FormType[];
  nodeMap: Record<string, FormNodeType>;
};

type ContentType = {
  id: string;
  title: string;
  label: string;
  avantos_type: AvantosType;
  format?: "email";
  from: string;
};

function getSchemaProperties(
  form: FormType,
  action?: ({ avantos_type, format, title, from }: ContentType) => void,
) {
  // parse the form properties to an array of {id, title, aventos_type, format}
  const formProperties = (form?.field_schema?.properties ||
    {}) as FormProperties;

  const properties: ContentType[] = Object.entries(formProperties)
    .map(([key, property]) => ({
      id: form?.id + "_" + key,
      key: key,
      title: property.title,
      label: property.title,
      avantos_type: property.avantos_type,
      format: property.format,
      from: form?.name,
      action: () => action?.({ ...property, from: form?.name, title: key }),
    }))
    // do not show button component has it can not be inherited
    .filter((property) => property.key?.toLowerCase() !== "button");

  const title = form?.name || "Form";

  return { title, properties, id: form?.id };
}

function getPrerequisites(
  node: FormNodeType | null,
  nodeMap?: Record<string, FormNodeType>,
  results: Record<string, FormNodeType> = {},
): Record<string, FormNodeType> {
  if (!node) return results;

  const prerequisites = node.data?.prerequisites || [];

  // if there are no prerequisites, return the current results
  if (prerequisites.length === 0) return results;

  const updatedResults = { ...results };

  for (const prerequisite of prerequisites) {
    const prerequisiteNode = nodeMap?.[prerequisite];
    if (!prerequisiteNode) {
      continue;
    }

    updatedResults[prerequisite] = prerequisiteNode;
    // Recursively get prerequisites and merge results
    const nestedResults = getPrerequisites(
      prerequisiteNode,
      nodeMap,
      updatedResults,
    );
    Object.assign(updatedResults, nestedResults);
  }

  return updatedResults;
}

function getTypeAsLabel(type: string, title: string) {
  if (type === "short-text") return title?.toLowerCase() || "";
  if (type === "object_enum") return "dynamic_object";
  if (type === "checkbox_group") return "checkbox_group";
  if (type === "dynamic_checkbox_group") return "dynamic_checkbox_group";

  return title?.toLowerCase() || "";
}

export function PrefillDialog(props: PrefillDialogProps) {
  const selectedNode = useCurrentNode();
  const { handleFieldClick, selectedField } = useSelectedFieldContext();
  const { updateCurrentForm } = useCurrentForm();
  const [viewPrefill, setViewPrefill] = useState(true);

  const handleActionClick = (action: ContentType) => {
    const title = action.title?.replace(/ /g, "_").toLowerCase() || "";
    const key = selectedField?.fieldKey?.replace(/ /g, "_").toLowerCase() || "";

    // if the action avantos type or title matches the selected field key, trigger the action

    if (action.avantos_type === key || title === key) {
      // TODO: set the attached fields here
      const formLabel =
        action?.from
          ?.split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ") || "";

      const actionLabel = getTypeAsLabel(action.avantos_type, action.title);

      updateCurrentForm({
        from: formLabel,
        data: {
          [actionLabel]: `${actionLabel}: ${formLabel}.${action.title}`,
        },
      });

      toast.success(`Successfully mapped data from form ${formLabel}!`, {
        position: "top-right",
        className: "bg-green-700! text-white!",
      });

      setViewPrefill(true);
      return;
    }

    toast.error("Action not compatible types", {
      description: `Invalid data type selected. It must be of type ${title}`,
      position: "top-right",
      className: "bg-destructive! text-white!",
    });
  };

  const formMap = useMemo(() => {
    const map: Record<string, FormType> = {};

    props.forms.forEach((form: FormType) => {
      map[form.id] = form;
    });

    return map;
  }, [props.forms, selectedNode]);

  const dependencyNodes = useMemo(() => {
    const results: Record<string, FormNodeType> = {};
    const nodes = getPrerequisites(selectedNode!, props.nodeMap, results);
    const data = Object.entries(nodes).map(([key, node]) => {
      const form = formMap[node.data?.component_id || ""];
      const formProperties = getSchemaProperties(form, handleActionClick);
      return {
        node,
        form,
        properties: formProperties.properties,
        title: formProperties.title,
      };
    });

    // build unique data based on form id
    // this ensures there is no duplicate forms in the explorer even if multiple nodes are dependent on the same form
    const uniqueData = data.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.form?.id === value.form?.id),
    );

    return uniqueData;
  }, [selectedNode, getSchemaProperties, handleActionClick]);

  const prefillComponent = useMemo(() => {
    const form = formMap[selectedNode?.data?.component_id || ""];
    const { properties: schemaProperties } = getSchemaProperties(form);

    if (!viewPrefill) return null;

    return (
      <div className="p-4">
        <DialogHeader>
          <div className="flex justify-between align-center">
            <DialogTitle>Prefill</DialogTitle>
            <Switch
              id="switch-prefill"
              defaultChecked={viewPrefill}
              checked={viewPrefill}
              onCheckedChange={setViewPrefill}
            />
          </div>
          <DialogDescription>Prefill fields for this form</DialogDescription>
        </DialogHeader>
        <FieldGroup id="prefill-fields">
          {schemaProperties.map((property) => (
            <DynamicRenderer
              key={property.id}
              type={property.avantos_type}
              title={property.title}
              format={property.format}
              onChange={() => {
                handleFieldClick(
                  property.title,
                  selectedNode as unknown as FormType,
                );
                setViewPrefill(false);
              }}
            />
          ))}
        </FieldGroup>
      </div>
    );
  }, [viewPrefill, handleFieldClick]);

  const explorerComponent = useMemo(() => {
    const contents = dependencyNodes.map(({ form, properties, title }) => ({
      id: form?.id || "",
      group: title,
      contents: properties,
    }));

    if (viewPrefill) return null;
    return (
      <div className="py-4">
        <DialogHeader>
          <DialogTitle className="px-2.5 pb-1">
            Select data element to map
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="min-h-50 px-4 gap-1 items-start max-w-sm bg-zinc-50/50">
          <AppSidebar
            data={[
              {
                id: "action_properties",
                group: "Action Properties",
                contents: [],
              },
              {
                id: "client_organization_properties",
                group: "Client Organization Properties",
                contents: [],
              },
              ...contents,
            ]}
          />
        </FieldGroup>

        <DialogFooter className="px-4 mx-0.5"></DialogFooter>
      </div>
    );
  }, [viewPrefill, dependencyNodes]);

  // only render if the selected node is a form component
  if (selectedNode === null) return null;

  return (
    <DialogContent
      className="sm:max-w-sm md:max-w-lg p-0"
      showCloseButton={false}
    >
      {prefillComponent}
      {explorerComponent}
    </DialogContent>
  );
}
