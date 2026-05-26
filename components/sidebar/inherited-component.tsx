import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

type Action = {
  id: string;
  label: string;
  action?: () => void;
};

type DropdownItemProps = {
  title: string;
  contents: Action[];
};
function formatLabel(label: string) {
  let formattedLabel = label?.replace(/ /g, "_")?.toLowerCase() || "";
  return formattedLabel;
}
function DropdownGroup({ title, contents }: DropdownItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  return (
    <>
      <Button
        onClick={toggleDropdown}
        className="flex min-h-8 gap-2"
        variant="ghost"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="text-sm font-medium capitalize">{title}</span>
      </Button>

      {isOpen && contents.length > 0 ? (
        <div className="ml-10 mb-2 flex flex-col items-start justify-center gap-0.5">
          {contents.map((content) => (
            <Button
              className="rounded-md py-0.5 px-2 cursor-pointer"
              key={content.id}
              onClick={content.action}
              variant="ghost"
            >
              {formatLabel(content.label)}
            </Button>
          ))}
        </div>
      ) : null}
    </>
  );
}

type InheritedComponentData = {
  id: string;
  group: string;
  contents: Action[];
};
type InheritedComponentProps = {
  data: InheritedComponentData[];
};
export default function InheritedComponent({ data }: InheritedComponentProps) {
  return (
    <>
      {data.map((item) => (
        <DropdownGroup
          key={item.id}
          title={item.group}
          contents={item.contents}
        />
      ))}
    </>
  );
}
