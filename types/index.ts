export interface FormType {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: FieldSchema;
  ui_schema: UiSchema;
  dynamic_field_config: DynamicFieldConfig;
}

export interface UiSchema {
  type: string;
  elements: Element[];
}

export interface Element {
  type: string;
  scope: string;
  label: string;
  options?: Options;
}

export interface Options {
  format: string;
}

export interface DynamicFieldConfig {
  button: Button2;
  dynamic_checkbox_group: DynamicCheckboxGroup;
  dynamic_object: DynamicObject;
}

export interface Button2 {
  selector_field: string;
  payload_fields: PayloadFields;
  endpoint_id: string;
}

export interface PayloadFields {
  userId: UserId;
}

export interface UserId {
  type: string;
  value: string;
}

export interface FieldSchema {
  properties: FormProperties;
  required: string[];
  type: string;
}
export interface FormProperties {
  button: Button;
  dynamic_checkbox_group: DynamicCheckboxGroup;
  dynamic_object: DynamicObject;
  email: Email;
  id: Id;
  multi_select: MultiSelect;
  name: Name;
  notes: Notes;
}

export interface Button {
  avantos_type: "button";
  title: string;
  type: string;
}

export interface DynamicCheckboxGroup {
  avantos_type: "dynamic-checkbox-group";
  items: Items;
  type: string;
  uniqueItems: boolean;
}

export interface Items {
  enum: string[];
  type: string;
}

export interface DynamicObject {
  avantos_type: "object-enum";
  enum: any[];
  title: string;
  type: string;
}

export interface Email {
  avantos_type: "short-text";
  format: "email";
  title: string;
  type: string;
}

export interface Id {
  avantos_type: "short-text";
  title: string;
  type: string;
}

export interface MultiSelect {
  avantos_type: "multi-select";
  items: Items;
  type: string;
  uniqueItems: boolean;
}

export interface Name {
  avantos_type: "short-text";
  title: string;
  type: string;
}

export interface Notes {
  avantos_type: "multi-line-text";
  title: string;
  type: string;
}

export type AvantosType =
  | "button"
  | "checkbox-group"
  | "object-enum"
  | "short-text"
  | "multi-select"
  | "multi-line-text";

export type CurrentFormType = {
  from: string; // label of the form inherited from
  data: {
    email?: string; 
    object_enum?: string;
    checkbox_group?: string;
  };
};
