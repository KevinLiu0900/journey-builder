import { Field } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CurrentFormType } from '@/types';
import { Database } from 'lucide-react';

type CheckboxGroupInputProps = {
  currentValue: string;
  title: string;
  name: string;
  showLabel?: boolean;
  handleFieldFocus?: () => void;
  handleValueChange?: (v: string) => void;
};

export function CheckboxGroupInput(props: CheckboxGroupInputProps) {
  const showLabel = props?.showLabel;
  const fieldKey = props?.title?.toLowerCase().replace(/ /g, '_') as keyof CurrentFormType['data'];

  return (
    <Field className="gap-3">
      <div className="flex items-center justify-between">
        {showLabel && <Label className="text-sm font-medium">{props.title}</Label>}
      </div>
      <div className="flex items-center gap-2 p-2 border-[1.5px] border-dashed border-blue-200 rounded-lg bg-blue-50/50">
        <Database className="size-5 text-zinc-500 flex-shrink-0" />
        <label className="flex items-center gap-2 cursor-pointer flex-1">
          <Checkbox
            id={props.name || fieldKey}
            checked={!!props.currentValue}
            onClick={props.handleFieldFocus}
            onCheckedChange={checked => {
              props.handleValueChange?.(checked ? 'true' : '');
            }}
          />
          <span className="text-sm text-zinc-700"> {props.currentValue || 'dynamic_checkbox'}</span>
        </label>
      </div>
    </Field>
  );
}
