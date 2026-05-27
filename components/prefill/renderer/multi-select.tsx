import { Field } from '@/components/ui/field';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CurrentFormType, ValidationType } from '@/types';
import { X as CloseIcon } from 'lucide-react';

type MultiSelectInputProps = {
  currentValue: string;
  title: string;
  name: string;
  showLabel?: boolean;
  inherited?: boolean;
  validation?: ValidationType;
  handleReset?: () => void;
  handleFieldFocus?: () => void;
  handleValueChange?: (v: string) => void;
};

export function MultiSelectInput(props: MultiSelectInputProps) {
  const currentValue = props.currentValue || '';

  const validation = props?.validation;
  const inherited = props?.inherited;
  const showLabel = props?.showLabel;
  const fieldKey = props?.title?.toLowerCase().replace(/ /g, '_') as keyof CurrentFormType['data'];

  const selectedValues = currentValue
    ? currentValue
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
    : [];

  return (
    <Field className="gap-2">
      <div className="flex items-center justify-between">
        {showLabel && (
          <Label htmlFor={props.name || fieldKey} className="text-sm font-medium">
            {props.title}
          </Label>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((value, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-200 dark:bg-zinc-700 rounded-full text-sm"
            >
              <span>{value}</span>
              <button
                type="button"
                onClick={() => {
                  const filtered = selectedValues.filter((_, i) => i !== idx);
                  props.handleValueChange?.(filtered.join(', '));
                }}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                title="Remove"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <InputGroup>
          <InputGroupInput
            id={props.name || fieldKey}
            type="text"
            placeholder={`Add ${props.title || 'item'} and press comma`}
            onClick={props.handleFieldFocus}
            onKeyDown={e => {
              if (e.key === ',' || e.key === 'Enter') {
                e.preventDefault();
                const input = e.currentTarget;
                const newValue = input.value.trim();
                if (newValue) {
                  const updated = selectedValues.includes(newValue)
                    ? selectedValues
                    : [...selectedValues, newValue];
                  props.handleValueChange?.(updated.join(', '));
                  input.value = '';
                }
              }
            }}
            className={cn(
              'rounded-lg bg-zinc-50! focus-visible:bg-zinc-50!',
              !validation?.valid && 'border-destructive focus-visible:ring-destructive/20'
            )}
          />

          {inherited && (
            <InputGroupButton
              type="button"
              size="icon-xs"
              variant="ghost"
              onClick={props.handleReset}
              className="h-6 w-6 bg-zinc-700 hover:bg-zinc-700/70 mr-2 rounded-full"
              title="Clear all"
            >
              <CloseIcon className="size-4 text-white" />
            </InputGroupButton>
          )}
        </InputGroup>
      </div>

      {!validation?.valid && validation?.error && (
        <p className="text-sm text-destructive">{validation.error}</p>
      )}
    </Field>
  );
}
