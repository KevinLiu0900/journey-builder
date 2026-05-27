import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CurrentFormType, ValidationType } from '@/types';
import { X as CloseIcon } from 'lucide-react';

type MultiLineTextInputProps = {
  title: string;
  name: string;
  showLabel?: boolean;
  inherited?: boolean;
  currentValue: string;
  validation?: ValidationType;
  handleReset?: () => void;
  handleFieldFocus?: () => void;
  handleValueChange?: (v: string) => void;
};

export function MultiLineTextInput(props: MultiLineTextInputProps) {
  const validation = props?.validation;
  const inherited = props?.inherited;
  const showLabel = props?.showLabel;
  const fieldKey = props?.title?.toLowerCase().replace(/ /g, '_') as keyof CurrentFormType['data'];

  return (
    <Field className="gap-2">
      <div className="flex items-center justify-between">
        {showLabel && (
          <Label htmlFor={props.name || fieldKey} className="text-sm font-medium">
            {props.title}
          </Label>
        )}
      </div>

      <div className="relative">
        <Textarea
          id={props.name || fieldKey}
          placeholder={`Enter ${props.title || 'text'}`}
          defaultValue={props.currentValue}
          onClick={props.handleFieldFocus}
          onChange={e => props.handleValueChange?.(e.target.value)}
          aria-invalid={!validation?.valid}
          className={cn(
            'bg-zinc-50! focus-visible:bg-zinc-50!',
            !validation?.valid && 'border-destructive focus-visible:ring-destructive/20'
          )}
        />

        {inherited && (
          <button
            type="button"
            onClick={props.handleReset}
            className="absolute top-2 right-2 h-6 w-6 bg-zinc-700 hover:bg-zinc-700/70 rounded-full flex items-center justify-center"
            title="Clear field"
          >
            <CloseIcon className="size-4 text-white" />
          </button>
        )}
      </div>

      {!validation?.valid && validation?.error && (
        <p className="text-sm text-destructive">{validation.error}</p>
      )}
    </Field>
  );
}
