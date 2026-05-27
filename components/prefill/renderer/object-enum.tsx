import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrentFormType } from '@/types';
import { Database } from 'lucide-react';

type ObjectEnumInputProps = {
  currentValue: string;
  title: string;
  name: string;
  showLabel?: boolean;
  handleFieldFocus?: () => void;
  handleValueChange?: (v: string) => void;
};

export function ObjectEnumInput(props: ObjectEnumInputProps) {
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
      <div className="flex items-center gap-2 p-2 border-[1.5px] border-dashed border-zinc-200 rounded-lg bg-zinc-50/50">
        <Database className="size-5 text-zinc-500 flex-shrink-0" />
        <Input
          id={props.name || fieldKey}
          onClick={props.handleFieldFocus}
          type="text"
          placeholder="object_enum:"
          defaultValue={props.currentValue}
          onChange={e => props.handleValueChange?.(e.target.value)}
          className="border-0 bg-transparent p-0 focus-visible:ring-0"
        />
      </div>
    </Field>
  );
}
