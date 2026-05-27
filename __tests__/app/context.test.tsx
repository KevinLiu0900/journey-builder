import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormNodeProvider, useFormNode, useCurrentForm, useExplorer } from '@/app/context/index';
import { FormNodeType } from '@/components/flows/form-node';

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
  });
});
