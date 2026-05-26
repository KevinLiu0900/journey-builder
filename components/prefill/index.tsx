"use client";

import { useCurrentNode, useSelectedFieldContext } from "@/app/context";
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

type PrefillDialogProps = {
  forms: FormType[];
};

type ContentType = {
  id: string;
  title: string;
  label: string;
  avantos_type: AvantosType;
  format?: "email";
};

type DropdownContentType = {
  id: string;
  group: string;
  contents: ContentType[];
};

function getSchemaProperties(
  node: FormNodeType,
  formMap?: Record<string, FormType>,
  action?: () => void,
) {
  const formId = node?.data?.component_id;
  const form = formMap?.[formId];

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
      action: () => console.log("Clicked on ", property.title),
    }))
    // do not show button component has it can not be inherited
    .filter((property) => property.key?.toLowerCase() !== "button");

  const title = form?.name || "Form";

  return { title, properties, id: formId };
}

function getUniqueContent(contents: DropdownContentType[]) {
  const uniqueContents: Record<string, DropdownContentType> = {};

  contents.forEach((content) => {
    if (!uniqueContents[content.id]) {
      uniqueContents[content.id] = content;
    }
  });
  return Object.values(uniqueContents);
}
export function PrefillDialog(props: PrefillDialogProps) {
  const selectedNode = useCurrentNode();
  const { handleFieldClick, dependencyMap } = useSelectedFieldContext();
  const [viewPrefill, setViewPrefill] = useState(true);

  const inheritableNodes = dependencyMap?.[selectedNode?.id || ""] || {};

  const formMap = useMemo(() => {
    const map: Record<string, FormType> = {};

    props.forms.forEach((form: FormType) => {
      if (form.id === selectedNode?.data?.component_id) {
      }
      map[form.id] = form;
    });

    return map;
  }, [props.forms, selectedNode]);

  const prefillComponent = useMemo(() => {
    const { properties: schemaProperties } = getSchemaProperties(
      selectedNode as FormNodeType,
      formMap,
    );

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
          {Object.entries(schemaProperties).map(([key, property]) => (
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
    const inheritableForms = Object.values(inheritableNodes).map((node) =>
      getSchemaProperties(node, formMap),
    );
    const contents = inheritableForms.map((form) => {
      return {
        id: form.id,
        group: form.title,
        contents: form.properties,
      };
    });
    console.log("🚀 ~ PrefillDialog ~ contents:", contents);

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
              ...getUniqueContent(contents),
            ]}
          />
        </FieldGroup>

        <DialogFooter className="px-4 mx-0.5"></DialogFooter>
      </div>
    );
  }, [viewPrefill, inheritableNodes]);

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
