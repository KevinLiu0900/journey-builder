'use client';

import {
  useAttachFieldContext,
  useCurrentForm,
  useCurrentNode,
  useExplorer,
  useSelectedFieldContext,
} from '@/app/context';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Switch } from '../ui/switch';
import { useCallback, useMemo } from 'react';
import DynamicRenderer from './dynamic-renderer';
import { AvantosType, FormProperties, FormType } from '@/types';
import { AppSidebar } from '../sidebar';
import { FormNodeType } from '../flows/form-node';
import { toast } from 'sonner';
import { Button } from '../ui/button';

// Constants
const EXCLUDED_COMPONENTS = ['button'];
const COMPONENT_TYPE_MAPPING: Record<string, string> = {
  'short-text': 'short_text',
  object_enum: 'dynamic_object',
  checkbox_group: 'checkbox_group',
  dynamic_checkbox_group: 'dynamic_checkbox_group',
};

// Types
type PrefillDialogProps = {
  forms: FormType[];
  nodeMap: Record<string, FormNodeType>;
};

type PropertyContent = {
  id: string;
  key: string;
  title: string;
  label: string;
  avantos_type: AvantosType;
  format?: string;
  from: string;
};

type DependencyNodeData = {
  node: FormNodeType;
  form: FormType;
  properties: PropertyContent[];
  title: string;
};

// Utility Functions
/**
 * Extract form properties and convert to PropertyContent array
 */
function extractFormProperties(
  form: FormType | undefined,
  action?: (property: PropertyContent) => void
): PropertyContent[] {
  if (!form) return [];

  const formProperties = (form.field_schema?.properties || {}) as FormProperties;

  return Object.entries(formProperties)
    .map(([key, property]) => ({
      id: `${form.id}_${key}`,
      key,
      title: property.title || key,
      label: property.title || key,
      avantos_type: property.avantos_type,
      format: property.format,
      from: form.name || 'Form',
      action: () => action?.({ ...property, from: form?.name, title: key }),
    }))
    .filter(property => !EXCLUDED_COMPONENTS.includes(property.key.toLowerCase()));
}

/**
 * Map avantos type to field label format
 */
function getFieldLabelFromType(type: AvantosType, fallback: string): string {
  return (
    COMPONENT_TYPE_MAPPING[type as keyof typeof COMPONENT_TYPE_MAPPING] || fallback.toLowerCase()
  );
}

/**
 * Recursively get all prerequisite nodes
 */
function collectPrerequisiteNodes(
  node: FormNodeType | null,
  nodeMap: Record<string, FormNodeType>,
  collected: Record<string, FormNodeType> = {}
): Record<string, FormNodeType> {
  if (!node?.data?.prerequisites) return collected;

  const updated = { ...collected };

  for (const prereqId of node.data.prerequisites) {
    const prereqNode = nodeMap[prereqId];
    if (!prereqNode || prereqId in updated) continue;

    updated[prereqId] = prereqNode;
    // Recursively collect nested prerequisites
    Object.assign(updated, collectPrerequisiteNodes(prereqNode, nodeMap, updated));
  }

  return updated;
}

/**
 * Create form lookup map for efficient access
 */
function createFormMap(forms: FormType[]): Record<string, FormType> {
  return forms.reduce(
    (acc, form) => {
      acc[form.id] = form;
      return acc;
    },
    {} as Record<string, FormType>
  );
}

// Sub-components
function PrefillView({
  selectedNode,
  formMap,
  onFieldClick,
}: {
  selectedNode: FormNodeType;
  formMap: Record<string, FormType>;
  onFieldClick: (title: string, form: FormType) => void;
}) {
  const form = formMap[selectedNode?.data?.component_id || ''];
  const { handleAttachFieldClick, handleFieldClick } = useAttachFieldContext();
  const { updateCurrentForm } = useCurrentForm();

  const handleAction = useCallback(
    (property: PropertyContent) => {
      handleAttachFieldClick({
        fieldLabel: property.title,
        formName: property.from,
      });

      handleFieldClick(property.title, form);
    },
    [form, handleFieldClick, handleAttachFieldClick]
  );

  const handleValueChange = useCallback(
    (value: string, property: PropertyContent) => {
      // Update form with the value as it changes
      const fieldLabel = getFieldLabelFromType(property.avantos_type, property.title);

      updateCurrentForm({
        from: property.from,
        data: {
          [fieldLabel]: value,
        },
      });

      handleAction(property);
    },
    [updateCurrentForm, handleAction]
  );

  const properties = useMemo(() => extractFormProperties(form, handleAction), [form, handleAction]);

  return (
    <form className="p-4">
      <DialogHeader>
        <DialogTitle>Prefill</DialogTitle>
        <DialogDescription>Prefill fields for this form</DialogDescription>
      </DialogHeader>
      <FieldGroup id="prefill-fields">
        {properties.map(property => (
          <DynamicRenderer
            key={property.id}
            name={property.key}
            type={property.avantos_type}
            title={property.title}
            form={form}
            format={property.format as 'email' | undefined}
            onValueChange={value => handleValueChange(value, property)}
            onReset={() => {
              handleFieldClick(property.title, form);
              onFieldClick(property.title, form);
            }}
          />
        ))}
      </FieldGroup>
    </form>
  );
}

function ExplorerView({
  dependencyNodes,
  clearUp,
}: {
  dependencyNodes: DependencyNodeData[];
  clearUp?: () => void;
}) {
  const { updateCurrentForm } = useCurrentForm();
  const { attachedField, selectedField } = useAttachFieldContext();

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const from = attachedField?.formName || '';
      const key = attachedField?.fieldLabel || selectedField?.fieldKey || '';
      const value = `${attachedField?.fieldLabel}: ${attachedField?.formName}.${key}`;

      if (!attachedField) {
        toast.error('No field selected', {
          position: 'top-right',
          className: 'bg-destructive! text-white!',
        });
        return;
      }

      updateCurrentForm({
        from,
        data: {
          [key]: value,
        },
      });

      toast.success(`Mapped field from ${attachedField?.formName}`, {
        position: 'top-right',
        className: 'bg-green-700! text-white!',
      });

      clearUp?.();
    },
    [updateCurrentForm, clearUp, attachedField, selectedField]
  );

  const sidebarData = useMemo(
    () => [
      {
        id: 'action_properties',
        group: 'Action Properties',
        contents: [],
      },
      {
        id: 'client_organization_properties',
        group: 'Client Organization Properties',
        contents: [],
      },
      ...dependencyNodes.map(({ form, properties, title }) => ({
        id: form?.id || '',
        group: title,
        contents: properties,
      })),
    ],
    [dependencyNodes]
  );

  return (
    <form onSubmit={onSubmit} className="pb-4">
      <div className="">
        <div className="w-1/2">
          <FieldGroup className="min-h-50 px-4 gap-1 items-start max-w-sm bg-zinc-50/50">
            <AppSidebar data={sidebarData} />
          </FieldGroup>
        </div>
        <div className="w-1/2"></div>
      </div>

      <DialogFooter className="px-4 mx-0.5">
        <DialogClose asChild>
          <Button variant="outline" className="border-blue-400 text-blue-400! rounded-sm h-8">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="h-8 rounded-sm">
          Select
        </Button>
      </DialogFooter>
    </form>
  );
}

// Main Component
export function PrefillDialog(props: PrefillDialogProps) {
  const selectedNode = useCurrentNode();
  const { handleFieldClick, selectedField } = useSelectedFieldContext();
  const { handleAttachFieldClick } = useAttachFieldContext();
  const { explorer, toggleExplorer } = useExplorer();

  const onSubmitClearUp = useCallback(() => {
    toggleExplorer(true);
    handleAttachFieldClick(null);
  }, [toggleExplorer, handleAttachFieldClick]);

  const formMap = useMemo(() => createFormMap(props.forms), [props.forms]);

  const handlePropertyClick = useCallback(
    (property: PropertyContent) => {
      if (!selectedField) {
        toast.error('No field selected', {
          position: 'top-right',
        });
        return;
      }

      const selectedFieldKey = selectedField.fieldKey?.toLowerCase().replace(/ /g, '_') || '';
      const propertyKey = property.title.toLowerCase().replace(/ /g, '_');
      const typesMatch =
        property.avantos_type === selectedFieldKey || propertyKey === selectedFieldKey;

      if (!typesMatch) {
        toast.error('Type mismatch', {
          description: `Field requires type ${selectedFieldKey}, got ${property.avantos_type}`,
          position: 'top-right',
          className: 'bg-destructive! text-white!',
        });
        return;
      }

      handleAttachFieldClick({
        fieldLabel: property.title,
        formName: property.from,
      });
    },
    [selectedField, handleAttachFieldClick]
  );

  const dependencyNodes = useMemo<DependencyNodeData[]>(() => {
    if (!selectedNode) return [];

    const prerequisites = collectPrerequisiteNodes(selectedNode, props.nodeMap);
    const nodes = Object.values(prerequisites);

    // Build unique data, filtering duplicates by form ID
    const uniqueNodes = new Map<string, DependencyNodeData>();

    nodes.forEach(node => {
      const form = formMap[node.data?.component_id || ''];
      if (!form) return;

      if (!uniqueNodes.has(form.id)) {
        uniqueNodes.set(form.id, {
          node,
          form,
          properties: extractFormProperties(form, handlePropertyClick),
          title: form.name || 'Form',
        });
      }
    });

    return Array.from(uniqueNodes.values());
  }, [selectedNode, props.nodeMap, formMap, handlePropertyClick]);

  if (!selectedNode) return null;

  return (
    <DialogContent className="sm:max-w-sm md:max-w-lg p-0 gap-0" showCloseButton={false}>
      <div className="flex items-center justify-between px-4 pt-4">
        <DialogHeader>
          <DialogTitle className="px-2.5 pb-1">
            {explorer ? 'Prefill Options' : 'Select data element to map'}
          </DialogTitle>
        </DialogHeader>
        <Switch
          id="switch-prefill"
          checked={explorer}
          onCheckedChange={toggleExplorer}
          aria-label="Toggle between prefill and explorer view"
        />
      </div>

      {explorer ? (
        <PrefillView
          selectedNode={selectedNode}
          formMap={formMap}
          onFieldClick={(title, form) => {
            handleFieldClick(title, form);
            toggleExplorer(false);
          }}
        />
      ) : (
        <ExplorerView dependencyNodes={dependencyNodes} clearUp={onSubmitClearUp} />
      )}
    </DialogContent>
  );
}
