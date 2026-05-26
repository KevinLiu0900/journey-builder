"use client";

import { createContext, useContext, useState } from "react";

import type { FormNodeType } from "@/components/flows/form-node";
import { CurrentFormType, FormType } from "@/types";

type DependencyMapType = Record<string, Record<string, FormNodeType>> | null;

const context = createContext<{
  currentForm: CurrentFormType | null;
  dependencyMap: DependencyMapType;
  currentNode: FormNodeType | null;
  selectedField: {
    fieldKey: string;
    form: FormType | null;
  };
  handleNodeClick: (node: FormNodeType | null) => void;
  handleFieldClick: (fieldKey: string, form: FormType | null) => void;
  updateDependencies: (map: DependencyMapType) => void;
  updateCurrentForm: (form: CurrentFormType | null) => void;
  clearField: (field: string) => void;
  resetForm: () => void;
}>({
  currentForm: null,
  currentNode: null,
  dependencyMap: null,
  selectedField: {
    fieldKey: "",
    form: null,
  },
  handleNodeClick: () => {},
  handleFieldClick: () => {},
  updateDependencies: () => {},
  updateCurrentForm: () => {},
  clearField: () => {},
  resetForm: () => {},
});

export const FormNodeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentForm, setCurrentForm] = useState<CurrentFormType | null>(null);
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

  function updateCurrentForm(form: CurrentFormType | null) {
    setCurrentForm({
      from: form?.from || currentForm?.from || "",
      data: {
        ...currentForm?.data,
        ...form?.data,
      },
    });
  }
  function updateDependencies(map: DependencyMapType) {
    setDependencyMap(map);
  }

  function clearField(field: string) {
    updateCurrentForm({ data: { [field]: "" } } as CurrentFormType);
  }

  function resetForm() {
    setCurrentForm(null);
    setCurrentNode(null);
    setSelectedField({ fieldKey: "", form: null });
  }

  return (
    <context.Provider
      value={{
        currentForm,
        currentNode,
        dependencyMap,
        selectedField,
        handleNodeClick,
        handleFieldClick,
        updateDependencies,
        updateCurrentForm,
        resetForm,
        clearField,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useCurrentNode = () => useContext(context).currentNode;
export const useSelectedFieldContext = () => {
  const { dependencyMap, selectedField, handleFieldClick } =
    useContext(context);
  return { dependencyMap, selectedField, handleFieldClick };
};
export const useCurrentForm = () => {
  const { currentForm, clearField, updateCurrentForm } = useContext(context);
  return { currentForm, clearField, updateCurrentForm };
};
export const useFormNode = () => useContext(context);
