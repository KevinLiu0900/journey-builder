"use client";

import { AvantosType, CurrentFormType, FormType } from "@/types";
import { X as CloseIcon, Database } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Field } from "../ui/field";
import { cn } from "@/lib/utils";
import {
  useCurrentForm,
  useExplorer,
  useSelectedFieldContext,
} from "@/app/context";
import { useCallback, useMemo } from "react";
import * as v from "valibot";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";

type DynamicRendererProps = {
  type: AvantosType;
  title: string;
  format?: "email";
  inherited?: boolean;
  inheritFrom?: string;
  onChange?: () => void;
  onReset?: () => void;
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  showLabel?: boolean;
  form: FormType;
};

// Validation schemas using valibot
const emailSchema = v.pipe(v.string("Email must be a string"));

const requiredSchema = v.string("This field is required");

function validateField(
  value: string,
  format?: "email",
): { valid: boolean; error?: string } {
  try {
    if (format === "email") {
      v.parse(emailSchema, value);
    } else {
      v.parse(requiredSchema, value);
    }
    return { valid: true };
  } catch (error) {
    if (error instanceof v.ValiError) {
      return { valid: false, error: error.issues[0]?.message };
    }
    return { valid: false, error: "Validation failed" };
  }
}

export default function DynamicRenderer(props: DynamicRendererProps) {
  const { currentForm, clearField } = useCurrentForm();
  const { handleFieldClick } = useSelectedFieldContext();
  const { toggleExplorer } = useExplorer();

  const fieldKey = props.title
    ?.toLowerCase()
    .replace(/ /g, "_") as keyof CurrentFormType["data"];

  const showLabel = props?.showLabel || false;
  const inherited = !!currentForm?.data?.[fieldKey || ""] || false;
  const currentValue = (currentForm?.data?.[fieldKey || ""] as string) || "";

  const handleReset = useCallback(() => {
    clearField(fieldKey);
    props.onReset?.();
  }, [fieldKey, clearField, props]);

  const handleFieldFocus = useCallback(() => {
    handleFieldClick(fieldKey, props.form);
    if (!currentValue) {
      toggleExplorer();
    }
  }, [fieldKey, handleFieldClick, props.form, toggleExplorer, currentValue]);

  const handleValueChange = useCallback(
    (value: string) => {
      props.onValueChange?.(value);
    },
    [props],
  );

  const validation = useMemo(() => {
    return validateField(currentValue, props.format);
  }, [currentValue, props.format]);

  switch (props.type) {
    case "short-text": {
      if (!props.format) return null; // TODO: Only support email for now

      return (
        <Field className="gap-2">
          <div className="flex items-center justify-between">
            {showLabel && (
              <Label
                htmlFor={props.name || fieldKey}
                className="text-sm font-medium"
              >
                {props.title}
              </Label>
            )}
          </div>

          <InputGroup>
            <InputGroupInput
              name={props.name || fieldKey}
              type={"email"}
              placeholder={`Enter ${props.format || "text"}`}
              defaultValue={currentValue}
              onClick={handleFieldFocus}
              onChange={(e) => handleValueChange(e.target.value)}
              aria-invalid={!validation.valid}
              className={cn(
                "rounded-lg bg-zinc-50! focus-visible:bg-zinc-50!",
                !validation.valid &&
                  "border-destructive focus-visible:ring-destructive/20",
              )}
            />

            {inherited && (
              <InputGroupButton
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={handleReset}
                className="h-6 w-6 bg-zinc-700 hover:bg-zinc-700/70  mr-2 rounded-full"
                title="Clear field"
              >
                <CloseIcon className="size-4 text-white" />
              </InputGroupButton>
            )}
          </InputGroup>
          {!validation.valid && validation.error && (
            <p className="text-sm text-destructive">{validation.error}</p>
          )}
        </Field>
      );
    }

    case "object-enum": {
      return (
        <Field className="gap-2">
          <div className="flex items-center justify-between">
            {showLabel && (
              <Label
                htmlFor={props.name || fieldKey}
                className="text-sm font-medium"
              >
                {props.title}
              </Label>
            )}
          </div>
          <div className="flex items-center gap-2 p-2 border-[1.5px] border-dashed border-zinc-200 rounded-lg bg-zinc-50/50">
            <Database className="size-5 text-zinc-500 flex-shrink-0" />
            <Input
              id={props.name || fieldKey}
              onClick={handleFieldFocus}
              type="text"
              placeholder="object_enum:"
              defaultValue={currentValue}
              onChange={(e) => handleValueChange(e.target.value)}
              className="border-0 bg-transparent p-0 focus-visible:ring-0"
            />
          </div>
        </Field>
      );
    }

    case "checkbox-group": {
      return (
        <Field className="gap-3">
          <div className="flex items-center justify-between">
            {showLabel && (
              <Label className="text-sm font-medium">{props.title}</Label>
            )}
          </div>
          <div className="flex items-center gap-2 p-2 border-[1.5px] border-dashed border-blue-200 rounded-lg bg-blue-50/50">
            <Database className="size-5 text-zinc-500 flex-shrink-0" />
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <Checkbox
                id={props.name || fieldKey}
                checked={!!currentValue}
                onClick={handleFieldFocus}
                onCheckedChange={(checked) => {
                  handleValueChange(checked ? "true" : "");
                }}
              />
              <span className="text-sm text-zinc-700">
                {" "}
                {currentValue || "dynamic_checkbox"}
              </span>
            </label>
          </div>
        </Field>
      );
    }

    default:
      return null;
  }
}
