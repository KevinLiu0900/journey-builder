'use client';

import { AvantosType, CurrentFormType, FormType } from '@/types';
import { useCallback, useMemo } from 'react';
import * as v from 'valibot';
import { useCurrentForm, useExplorer, useSelectedFieldContext } from '@/app/context';
import {
  ShortTextInput,
  ObjectEnumInput,
  CheckboxGroupInput,
  // MultiLineTextInput,
  // MultiSelectInput,
} from '.';

type RendererEngineProps = {
  type: AvantosType;
  title: string;
  format?: 'email' | 'url' | 'text';
  inherited?: boolean;
  inheritFrom?: string;
  name?: string;
  value?: string;
  error?: string;
  showLabel?: boolean;
  form: FormType;
  onChange?: () => void;
  onReset?: () => void;
  onValueChange?: (value: string) => void;
};

// Validation schemas using valibot
const emailSchema = v.pipe(
  v.string('Email must be a string')
  // v.email('Must be a valid email')
);

const urlSchema = v.pipe(v.string('URL must be a string'), v.url('Must be a valid URL'));

const requiredSchema = v.string('This field is required');

const multiLineSchema = v.string('Multi-line text must be a string');

const multiSelectSchema = v.string('Multi-select must contain at least one value');

function validateField(
  value: string,
  format?: 'email' | 'url' | 'text' | 'multiline' | 'multiselect'
): { valid: boolean; error?: string } {
  try {
    if (!value && format !== 'multiline') {
      return { valid: false, error: 'This field is required' };
    }

    if (format === 'email') {
      v.parse(emailSchema, value);
    } else if (format === 'url') {
      v.parse(urlSchema, value);
    } else if (format === 'multiline') {
      v.parse(multiLineSchema, value);
    } else if (format === 'multiselect') {
      v.parse(multiSelectSchema, value);
    } else {
      v.parse(requiredSchema, value);
    }
    return { valid: true };
  } catch (error) {
    if (error instanceof v.ValiError) {
      return { valid: false, error: error.issues[0]?.message };
    }
    return { valid: false, error: 'Validation failed' };
  }
}

export default function RendererEngine(props: RendererEngineProps) {
  const { currentForm, clearField } = useCurrentForm();
  const { handleFieldClick } = useSelectedFieldContext();
  const { toggleExplorer } = useExplorer();

  const fieldKey = props.title?.toLowerCase().replace(/ /g, '_') as keyof CurrentFormType['data'];

  const showLabel = props?.showLabel || false;
  const inherited = !!currentForm?.data?.[fieldKey || ''] || false;
  const currentValue = (currentForm?.data?.[fieldKey || ''] as string) || '';

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
    [props]
  );

  const validation = useMemo(() => {
    return validateField(currentValue, props.format);
  }, [currentValue, props.format]);

  switch (props.type) {
    case 'short-text': {
      return (
        <ShortTextInput
          currentValue={currentValue}
          title={props.title}
          name={props.name || fieldKey}
          format={props.format as 'email' | 'url' | 'text' | undefined}
          // validation={validation}
          showLabel={showLabel}
          inherited={inherited}
          handleReset={handleReset}
          handleFieldFocus={handleFieldFocus}
          handleValueChange={handleValueChange}
        />
      );
    }

    case 'object-enum': {
      return (
        <ObjectEnumInput
          currentValue={currentValue}
          title={props.title}
          name={props.name || fieldKey}
          showLabel={showLabel}
          handleFieldFocus={handleFieldFocus}
          handleValueChange={handleValueChange}
        />
      );
    }

    case 'checkbox-group': {
      return (
        <CheckboxGroupInput
          currentValue={currentValue}
          title={props.title}
          name={props.name || fieldKey}
          showLabel={showLabel}
          handleFieldFocus={handleFieldFocus}
          handleValueChange={handleValueChange}
        />
      );
    }

    // case 'multi-line-text': {
    //   return (
    //     <MultiLineTextInput
    //       currentValue={currentValue}
    //       title={props.title}
    //       name={props.name || fieldKey}
    //       // validation={validation}
    //       showLabel={showLabel}
    //       inherited={inherited}
    //       handleReset={handleReset}
    //       handleFieldFocus={handleFieldFocus}
    //       handleValueChange={handleValueChange}
    //     />
    //   );
    // }

    // case 'multi-select': {
    //   return (
    //     <MultiSelectInput
    //       currentValue={currentValue}
    //       title={props.title}
    //       name={props.name || fieldKey}
    //       validation={validation}
    //       showLabel={showLabel}
    //       inherited={inherited}
    //       handleReset={handleReset}
    //       handleFieldFocus={handleFieldFocus}
    //       handleValueChange={handleValueChange}
    //     />
    //   );
    // }

    default:
      return null;
  }
}
