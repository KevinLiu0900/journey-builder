"use client";

import { createContext, useContext, useState } from "react";

import type { FormNodeType } from "@/components/flows/form-node";
import { CurrentFormType, FormType } from "@/types";

type DependencyMapType = Record<string, Record<string, FormNodeType>> | null;
type AttachedFieldType = { formName: string; fieldLabel: string } | null;
type SelectedFieldType = {
  from: string;
  fieldKey: string;
  form: FormType | null;
} | null;

const context = createContext<{
  explorer: boolean;
  currentForm: CurrentFormType | null;
  dependencyMap: DependencyMapType;
  currentNode: FormNodeType | null;
  attachedField: AttachedFieldType;
  selectedField: SelectedFieldType;
  handleNodeClick: (node: FormNodeType | null) => void;
  handleAttachFieldClick: (field: AttachedFieldType) => void;
  handleFieldClick: (fieldKey: string, form: FormType | null) => void;
  updateDependencies: (map: DependencyMapType) => void;
  updateCurrentForm: (form: CurrentFormType | null) => void;
  clearField: (field: string) => void;
  resetForm: () => void;
  toggleExplorer: (show?: boolean) => void;
}>({
  explorer: false,
  currentForm: null,
  currentNode: null,
  dependencyMap: null,
  attachedField: null,
  selectedField: null,
  handleNodeClick: () => {},
  handleAttachFieldClick: () => {},
  handleFieldClick: () => {},
  updateDependencies: () => {},
  updateCurrentForm: () => {},
  clearField: () => {},
  resetForm: () => {},
  toggleExplorer: () => {},
});

export const FormNodeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentForm, setCurrentForm] = useState<CurrentFormType | null>(null);
  const [currentNode, setCurrentNode] = useState<FormNodeType | null>(null);
  const [dependencyMap, setDependencyMap] = useState<DependencyMapType>(null);
  const [attachedField, setAttachedField] = useState<AttachedFieldType>(null);
  const [selectedField, setSelectedField] = useState<SelectedFieldType>(null);
  const [showPrefill, setShowPrefill] = useState<boolean>(true);

  function handleNodeClick(node: FormNodeType | null) {
    setCurrentNode(node);
  }
  function handleAttachFieldClick(field: AttachedFieldType) {
    setAttachedField(field);
  }
  function handleFieldClick(fieldKey: string, form: FormType | null) {
    setSelectedField({
      from: form?.name || "",
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
    setSelectedField(null);
  }

  function toggleExplorer(show?: boolean) {
    setShowPrefill((prev) => show ?? !prev);
  }

  return (
    <context.Provider
      value={{
        explorer: showPrefill,
        attachedField,
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
        handleAttachFieldClick,
        toggleExplorer,
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
export const useAttachFieldContext = () => {
  const {
    attachedField,
    selectedField,
    handleAttachFieldClick,
    handleFieldClick,
  } = useContext(context);
  return {
    attachedField,
    selectedField,
    handleAttachFieldClick,
    handleFieldClick,
  };
};
export const useExplorer = () => {
  const { explorer, toggleExplorer } = useContext(context);
  return { explorer, toggleExplorer };
};
export const useCurrentForm = () => {
  const { currentForm, clearField, updateCurrentForm } = useContext(context);
  return { currentForm, clearField, updateCurrentForm };
};
export const useFormNode = () => useContext(context);
