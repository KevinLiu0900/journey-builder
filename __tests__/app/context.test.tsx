import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  FormNodeProvider,
  useFormNode,
  useCurrentForm,
  useExplorer,
  useCurrentNode,
  useSelectedFieldContext,
  useAttachFieldContext,
} from '@/app/context/index';
import { FormNodeType } from '@/components/flows/form-node';
import { FormType } from '@/types/index';

// Test component that uses the context
function TestFormNodeComponent() {
  const {
    currentForm,
    currentNode,
    dependencyMap,
    handleNodeClick,
    updateCurrentForm,
    resetForm,
    toggleExplorer,
    explorer,
  } = useFormNode();

  const mockNode: FormNodeType = {
    id: 'form-1',
    position: { x: 0, y: 0 },
    type: 'form',
    data: {
      id: 'form-1',
      component_key: 'key-1',
      component_type: 'form',
      component_id: 'comp-1',
      name: 'Test Form',
      prerequisites: [],
      permitted_roles: [],
      input_mapping: {},
      sla_duration: { number: 0, unit: 'minutes' },
      approval_required: false,
      approval_roles: [],
    },
  };

  return (
    <div>
      <div data-testid="current-form">{currentForm?.from || 'none'}</div>
      <div data-testid="current-node">{currentNode?.id || 'none'}</div>
      <div data-testid="explorer-state">{explorer ? 'open' : 'closed'}</div>
      <button onClick={() => handleNodeClick(mockNode)}>Select Node</button>
      <button
        onClick={() =>
          updateCurrentForm({
            from: 'form-1',
            data: { email: 'test@test.com' },
          })
        }
      >
        Update Form
      </button>
      <button onClick={() => resetForm()}>Reset Form</button>
      <button onClick={() => toggleExplorer()}>Toggle Explorer</button>
    </div>
  );
}

describe('app/context/index.tsx', () => {
  describe('FormNodeProvider', () => {
    it('should update currentNode on handleNodeClick', async () => {
      render(
        <FormNodeProvider>
          <TestFormNodeComponent />
        </FormNodeProvider>
      );

      const selectButton = screen.getByText('Select Node');
      fireEvent.click(selectButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-node')).toHaveTextContent('form-1');
      });
    });

    it('should update currentForm on updateCurrentForm', async () => {
      render(
        <FormNodeProvider>
          <TestFormNodeComponent />
        </FormNodeProvider>
      );

      const updateButton = screen.getByText('Update Form');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-form')).toHaveTextContent('form-1');
      });
    });

    it('should reset all state on resetForm', async () => {
      render(
        <FormNodeProvider>
          <TestFormNodeComponent />
        </FormNodeProvider>
      );

      // Set some state
      fireEvent.click(screen.getByText('Select Node'));
      fireEvent.click(screen.getByText('Update Form'));

      await waitFor(() => {
        expect(screen.getByTestId('current-node')).toHaveTextContent('form-1');
      });

      // Reset
      fireEvent.click(screen.getByText('Reset Form'));

      await waitFor(() => {
        expect(screen.getByTestId('current-node')).toHaveTextContent('none');
        expect(screen.getByTestId('current-form')).toHaveTextContent('none');
      });
    });
  });

  describe('useCurrentForm hook', () => {
    function TestCurrentFormComponent() {
      const { currentForm, updateCurrentForm, clearField } = useCurrentForm();

      return (
        <div>
          <div data-testid="form-email">{(currentForm?.data?.email as string) || 'no email'}</div>
          <button
            onClick={() =>
              updateCurrentForm({
                from: 'test',
                data: { email: 'new@test.com' },
              })
            }
          >
            Update Email
          </button>
          <button onClick={() => clearField('email')}>Clear Email</button>
        </div>
      );
    }

    it('should provide current form data', async () => {
      render(
        <FormNodeProvider>
          <TestCurrentFormComponent />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Update Email'));

      await waitFor(() => {
        expect(screen.getByTestId('form-email')).toHaveTextContent('new@test.com');
      });
    });

    it('should clear field', async () => {
      render(
        <FormNodeProvider>
          <TestCurrentFormComponent />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Update Email'));

      await waitFor(() => {
        expect(screen.getByTestId('form-email')).toHaveTextContent('new@test.com');
      });

      fireEvent.click(screen.getByText('Clear Email'));

      await waitFor(() => {
        expect(screen.getByTestId('form-email')).toHaveTextContent('no email');
      });
    });
  });

  describe('useExplorer hook', () => {
    function TestExplorerComponent() {
      const { explorer, toggleExplorer } = useExplorer();

      return (
        <div>
          <div data-testid="explorer-value">{explorer ? 'visible' : 'hidden'}</div>
          <button onClick={() => toggleExplorer()}>Toggle</button>
          <button onClick={() => toggleExplorer(true)}>Show</button>
          <button onClick={() => toggleExplorer(false)}>Hide</button>
        </div>
      );
    }

    it('should set explorer to true explicitly', async () => {
      render(
        <FormNodeProvider>
          <TestExplorerComponent />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Show'));

      await waitFor(() => {
        expect(screen.getByTestId('explorer-value')).toHaveTextContent('visible');
      });
    });

    it('should set explorer to false explicitly', async () => {
      render(
        <FormNodeProvider>
          <TestExplorerComponent />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Show'));

      await waitFor(() => {
        expect(screen.getByTestId('explorer-value')).toHaveTextContent('visible');
      });

      fireEvent.click(screen.getByText('Hide'));

      await waitFor(() => {
        expect(screen.getByTestId('explorer-value')).toHaveTextContent('hidden');
      });
    });

    it('should toggle explorer state without explicit value', async () => {
      render(
        <FormNodeProvider>
          <TestExplorerComponent />
        </FormNodeProvider>
      );

      const toggleButton = screen.getByText('Toggle');

      // Initial state is true (default)
      expect(screen.getByTestId('explorer-value')).toHaveTextContent('visible');

      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId('explorer-value')).toHaveTextContent('hidden');
      });

      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId('explorer-value')).toHaveTextContent('visible');
      });
    });
  });

  describe('useCurrentNode hook', () => {
    function TestCurrentNodeComponent() {
      const currentNode = useCurrentNode();

      return (
        <div>
          <div data-testid="current-node-id">{currentNode?.id || 'none'}</div>
          <div data-testid="current-node-name">{currentNode?.data?.name || 'no-name'}</div>
        </div>
      );
    }

    const mockNode: FormNodeType = {
      id: 'form-1',
      position: { x: 0, y: 0 },
      type: 'form',
      data: {
        id: 'form-1',
        component_key: 'key-1',
        component_type: 'form',
        component_id: 'comp-1',
        name: 'Test Node',
        prerequisites: [],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: 'minutes' },
        approval_required: false,
        approval_roles: [],
      },
    };

    function TestWithNodeSelection() {
      const { handleNodeClick } = useFormNode();

      return (
        <div>
          <TestCurrentNodeComponent />
          <button onClick={() => handleNodeClick(mockNode)}>Set Node</button>
          <button onClick={() => handleNodeClick(null)}>Clear Node</button>
        </div>
      );
    }

    it('should provide current node from context', async () => {
      render(
        <FormNodeProvider>
          <TestWithNodeSelection />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Set Node'));

      await waitFor(() => {
        expect(screen.getByTestId('current-node-id')).toHaveTextContent('form-1');
        expect(screen.getByTestId('current-node-name')).toHaveTextContent('Test Node');
      });
    });

    it('should return none when node is not set', () => {
      render(
        <FormNodeProvider>
          <TestCurrentNodeComponent />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('current-node-id')).toHaveTextContent('none');
    });

    it('should clear node when set to null', async () => {
      render(
        <FormNodeProvider>
          <TestWithNodeSelection />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Set Node'));

      await waitFor(() => {
        expect(screen.getByTestId('current-node-id')).toHaveTextContent('form-1');
      });

      fireEvent.click(screen.getByText('Clear Node'));

      await waitFor(() => {
        expect(screen.getByTestId('current-node-id')).toHaveTextContent('none');
      });
    });
  });

  describe('useSelectedFieldContext hook', () => {
    function TestSelectedFieldComponent() {
      const { selectedField, dependencyMap } = useSelectedFieldContext();

      return (
        <div>
          <div data-testid="selected-field-key">{selectedField?.fieldKey || 'none'}</div>
          <div data-testid="selected-field-from">{selectedField?.from || 'none'}</div>
          <div data-testid="dependency-map">{dependencyMap ? 'present' : 'absent'}</div>
        </div>
      );
    }

    function TestWithFieldSelection() {
      const { handleFieldClick } = useFormNode();
      const mockForm: FormType = {
        id: 'form-1',
        name: 'Test Form',
        description: 'Test',
        is_reusable: true,
        field_schema: { type: 'object', properties: {}, required: [] },
        ui_schema: { type: 'object', elements: [] },
        dynamic_field_config: {
          button: {
            selector_field: '',
            payload_fields: { userId: { type: '', value: '' } },
            endpoint_id: '',
          },
          dynamic_checkbox_group: { items: { enum: [], type: '' }, type: '', uniqueItems: false },
          dynamic_object: { enum: [], title: '', type: '' },
        },
      };

      return (
        <div>
          <TestSelectedFieldComponent />
          <button onClick={() => handleFieldClick('testField', mockForm)}>Select Field</button>
        </div>
      );
    }

    it('should provide selected field context', async () => {
      render(
        <FormNodeProvider>
          <TestWithFieldSelection />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Select Field'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-field-key')).toHaveTextContent('testField');
      });
    });

    it('should return none when field is not selected', () => {
      render(
        <FormNodeProvider>
          <TestSelectedFieldComponent />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('selected-field-key')).toHaveTextContent('none');
    });

    it('should provide form information in selected field', async () => {
      render(
        <FormNodeProvider>
          <TestWithFieldSelection />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Select Field'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-field-from')).toHaveTextContent('Test Form');
      });
    });
  });

  describe('useAttachFieldContext hook', () => {
    function TestAttachFieldComponent() {
      const { attachedField, selectedField } = useAttachFieldContext();

      return (
        <div>
          <div data-testid="attached-field-label">{attachedField?.fieldLabel || 'none'}</div>
          <div data-testid="attached-field-form">{attachedField?.formName || 'none'}</div>
          <div data-testid="selected-field-info">{selectedField?.fieldKey || 'none'}</div>
        </div>
      );
    }

    function TestWithAttachedField() {
      const { handleAttachFieldClick } = useFormNode();

      return (
        <div>
          <TestAttachFieldComponent />
          <button
            onClick={() =>
              handleAttachFieldClick({
                fieldLabel: 'testField',
                formName: 'testForm',
              })
            }
          >
            Attach Field
          </button>
          <button onClick={() => handleAttachFieldClick(null)}>Clear Attachment</button>
        </div>
      );
    }

    it('should attach field with label and form name', async () => {
      render(
        <FormNodeProvider>
          <TestWithAttachedField />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Attach Field'));

      await waitFor(() => {
        expect(screen.getByTestId('attached-field-label')).toHaveTextContent('testField');
        expect(screen.getByTestId('attached-field-form')).toHaveTextContent('testForm');
      });
    });

    it('should return none when field is not attached', () => {
      render(
        <FormNodeProvider>
          <TestAttachFieldComponent />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('attached-field-label')).toHaveTextContent('none');
    });

    it('should clear attached field when set to null', async () => {
      render(
        <FormNodeProvider>
          <TestWithAttachedField />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Attach Field'));

      await waitFor(() => {
        expect(screen.getByTestId('attached-field-label')).toHaveTextContent('testField');
      });

      fireEvent.click(screen.getByText('Clear Attachment'));

      await waitFor(() => {
        expect(screen.getByTestId('attached-field-label')).toHaveTextContent('none');
      });
    });
  });

  describe('updateDependencies', () => {
    function TestDependencyMapComponent() {
      const { dependencyMap } = useSelectedFieldContext();

      return <div data-testid="dependency-map">{JSON.stringify(dependencyMap) || 'null'}</div>;
    }

    function TestWithDependencies() {
      const { updateDependencies } = useFormNode();

      const mockMap = {
        'form-1': {
          'form-0': {
            id: 'form-0',
            position: { x: 0, y: 0 },
            type: 'form',
            data: {
              id: 'form-0',
              component_key: 'key-0',
              component_type: 'form',
              component_id: 'comp-0',
              name: 'Base Form',
              prerequisites: [],
              permitted_roles: [],
              input_mapping: {},
              sla_duration: { number: 0, unit: 'minutes' },
              approval_required: false,
              approval_roles: [],
            },
          },
        },
      };

      return (
        <div>
          <TestDependencyMapComponent />
          <button onClick={() => updateDependencies(mockMap)}>Set Dependencies</button>
          <button onClick={() => updateDependencies(null)}>Clear Dependencies</button>
        </div>
      );
    }

    it('should update dependencies map', async () => {
      render(
        <FormNodeProvider>
          <TestWithDependencies />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Set Dependencies'));

      await waitFor(() => {
        const depElement = screen.getByTestId('dependency-map');
        expect(depElement.textContent).toContain('form-1');
      });
    });

    it('should clear dependencies when set to null', async () => {
      render(
        <FormNodeProvider>
          <TestWithDependencies />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Set Dependencies'));

      await waitFor(() => {
        const depElement = screen.getByTestId('dependency-map');
        expect(depElement.textContent).toContain('form-1');
      });

      fireEvent.click(screen.getByText('Clear Dependencies'));

      await waitFor(() => {
        expect(screen.getByTestId('dependency-map')).toHaveTextContent('null');
      });
    });
  });

  describe('Context state isolation', () => {
    it('should not share state between multiple providers', () => {
      const TestComponent1 = () => {
        const { currentNode } = useFormNode();
        return <div data-testid="node-1">{currentNode?.id || 'none'}</div>;
      };

      const TestComponent2 = () => {
        const { currentNode } = useFormNode();
        return <div data-testid="node-2">{currentNode?.id || 'none'}</div>;
      };

      const { container: container1 } = render(
        <FormNodeProvider>
          <TestComponent1 />
        </FormNodeProvider>
      );

      const { container: container2 } = render(
        <FormNodeProvider>
          <TestComponent2 />
        </FormNodeProvider>
      );

      // Both should have independent state
      expect(screen.getByTestId('node-1')).toHaveTextContent('none');
      expect(screen.getByTestId('node-2')).toHaveTextContent('none');
    });

    it('should maintain state across multiple hook calls', async () => {
      function MultiHookComponent() {
        const { currentNode, handleNodeClick } = useFormNode();
        const node = useCurrentNode();

        const mockNode: FormNodeType = {
          id: 'test-node',
          position: { x: 0, y: 0 },
          type: 'form',
          data: {
            id: 'form-1',
            component_key: 'key-1',
            component_type: 'form',
            component_id: 'comp-1',
            name: 'Multi Hook Test',
            prerequisites: [],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: 'minutes' },
            approval_required: false,
            approval_roles: [],
          },
        };

        return (
          <div>
            <div data-testid="hook1-node">{currentNode?.id || 'none'}</div>
            <div data-testid="hook2-node">{node?.id || 'none'}</div>
            <button onClick={() => handleNodeClick(mockNode)}>Set Both</button>
          </div>
        );
      }

      render(
        <FormNodeProvider>
          <MultiHookComponent />
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByText('Set Both'));

      await waitFor(() => {
        expect(screen.getByTestId('hook1-node')).toHaveTextContent('test-node');
        expect(screen.getByTestId('hook2-node')).toHaveTextContent('test-node');
      });
    });
  });
});
