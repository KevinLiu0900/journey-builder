import { Field } from '@/components/ui/field';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CurrentFormType, ValidationType } from '@/types';
import { X as CloseIcon } from 'lucide-react';

type ShortTextInputProps = {
  currentValue: string;
  title: string;
  name: string;
  format?: 'email' | 'url' | 'text';
  showLabel?: boolean;
  inherited?: boolean;
  handleReset?: () => void;
  validation?: ValidationType;
  handleFieldFocus?: () => void;
  handleValueChange?: (v: string) => void;
};

export function ShortTextInput(props: ShortTextInputProps) {
  const inputType = props.format === 'email' ? 'email' : props.format === 'url' ? 'url' : 'text';
  const placeholderText = props.name?.charAt(0).toUpperCase() + props.name.slice(1);

  //   const validation = props?.validation;
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

      <InputGroup className="bg-zinc-50!">
        <InputGroupInput
          name={props.name || fieldKey}
          type={inputType}
          placeholder={`${placeholderText}:`}
          defaultValue={props.currentValue}
          onClick={props.handleFieldFocus}
          onChange={e => props.handleValueChange?.(e.target.value)}
          //   aria-invalid={!validation?.valid}
          className={cn(
            'rounded-lg bg-zinc-50! focus-visible:bg-zinc-50!'
            // !validation?.valid && 'border-destructive focus-visible:ring-destructive/20'
          )}
        />

        {inherited && (
          <InputGroupButton
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={props.handleReset}
            className="h-6 w-6 bg-zinc-700 hover:bg-zinc-700/70  mr-2 rounded-full"
            title="Clear field"
          >
            <CloseIcon className="size-4 text-white" />
          </InputGroupButton>
        )}
      </InputGroup>
      {/* {!validation?.valid && validation?.error && (
        <p className="text-sm text-destructive">{validation.error}</p>
      )} */}
    </Field>
  );
}
