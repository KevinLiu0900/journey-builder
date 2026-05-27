"use client";

import { useAttachFieldContext } from "@/app/context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { Label } from "../ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";

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
  const formattedLabel = label?.replace(/ /g, "_")?.toLowerCase() || "";
  return formattedLabel;
}
function DropdownGroup({ title, contents }: DropdownItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { attachedField } = useAttachFieldContext();

  const isSeletected = (c: Action) => {
    if (!attachedField) return false;
    return (
      formatLabel(attachedField.fieldLabel) === formatLabel(c.label) &&
      title === attachedField.formName
    );
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  return (
    <>
      <Button
        onClick={toggleDropdown}
        className="flex min-h-8 gap-2"
        variant="ghost"
        type="button"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="text-sm font-medium capitalize">{title}</span>
      </Button>

      {isOpen && contents.length > 0 ? (
        <div className="ml-10 mb-2 flex flex-col items-start justify-center gap-0.5">
          {contents.map((content) => (
            <Button
              className={cn("rounded-md py-0.5 px-2 cursor-pointer", {
                "bg-blue-100": isSeletected(content),
              })}
              key={content.id}
              onClick={content.action}
              variant="ghost"
              type="button"
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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data
    .map((item) => ({
      ...item,
      contents: item.contents.filter((content) =>
        content.label.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((item) => (searchTerm ? item.contents.length > 0 : true));

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
    },
    [setSearchTerm],
  );

  return (
    <>
      <div className="ml-4 pt-2 space-y-2">
        <Label htmlFor="search" className="text-lg font-medium text-zinc-700">
          Available data
        </Label>
        <InputGroup>
          <InputGroupInput
            type={"search"}
            placeholder={"Search..."}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={cn("rounded-lg bg-zinc-50 outline-none ")}
          />

          <InputGroupAddon align="inline-start">
            <InputGroupButton
              type="button"
              size="icon-xs"
              variant="ghost"
              className="h-6 aspect-square bg-transparent rounded-full"
              title="Clear field"
            >
              <Search className="size-5 text-zinc-700 " />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {filteredData.map((item) => (
        <DropdownGroup
          key={item.id}
          title={item.group}
          contents={item.contents}
        />
      ))}
    </>
  );
}
