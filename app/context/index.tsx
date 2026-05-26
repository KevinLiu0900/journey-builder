"use client";

import { createContext, useContext, useState } from "react";

import type { FormNodeType } from "@/components/flows/form-node";
import { FormType } from "@/types";

type DependencyMapType = Record<string, Record<string, FormNodeType>> | null;

const context = createContext<{
  dependencyMap: DependencyMapType;
  currentNode: FormNodeType | null;
  selectedField: {
    fieldKey: string;
    form: FormType | null;
  };
  handleNodeClick: (node: FormNodeType | null) => void;
  handleFieldClick: (fieldKey: string, form: FormType | null) => void;
  updateDependencies: (map: DependencyMapType) => void;
}>({
  currentNode: null,
  dependencyMap: null,
  selectedField: {
    fieldKey: "",
    form: null,
  },
  handleNodeClick: () => {},
  handleFieldClick: () => {},
  updateDependencies: () => {},
});

export const FormNodeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentNode, setCurrentNode] = useState<FormNodeType | null>(null);
  const [dependencyMap, setDependencyMap] = useState<DependencyMapType>(null);
  const [selectedField, setSelectedField] = useState<{
    fieldKey: string;
    form: FormType | null;
  }>({ fieldKey: "", form: null });

  function handleNodeClick(node: FormNodeType | null) {
    setCurrentNode(node);
  }
  function handleFieldClick(fieldKey: string, form: FormType | null) {
    setSelectedField({
      fieldKey,
      form,
    });
  }

  function updateDependencies(map: DependencyMapType) {
    setDependencyMap(map);
  }

  return (
    <context.Provider
      value={{
        currentNode,
        dependencyMap,
        selectedField,
        handleNodeClick,
        handleFieldClick,
        updateDependencies,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useCurrentNode = () => useContext(context).currentNode;
export const useSelectedField = () => useContext(context).selectedField;
export const useSelectedFieldContext = () => {
  const { dependencyMap, selectedField, handleFieldClick } =
    useContext(context);
  return { dependencyMap, selectedField, handleFieldClick };
};
export const useFormNode = () => useContext(context);
