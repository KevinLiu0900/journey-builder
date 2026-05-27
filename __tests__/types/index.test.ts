import {
  FormType,
  FormNodeData,
  FieldSchema,
  Element,
  UiSchema,
  DynamicFieldConfig,
} from '@/types/index';

describe('types/index.ts - Type Definitions', () => {
  describe('FormNodeData', () => {
    it('should have all required properties', () => {
      const formNodeData: FormNodeData = {
        id: 'form-1',
        component_key: 'key-1',
        component_type: 'form',
        component_id: 'comp-1',
        name: 'Test Form',
        prerequisites: [],
        permitted_roles: ['admin'],
        input_mapping: { field1: 'source1' },
        sla_duration: { number: 24, unit: 'hours' },
        approval_required: true,
        approval_roles: ['manager'],
      };

      expect(formNodeData.id).toBe('form-1');
      expect(formNodeData.name).toBe('Test Form');
      expect(formNodeData.prerequisites).toEqual([]);
      expect(formNodeData.sla_duration.number).toBe(24);
      expect(formNodeData.approval_required).toBe(true);
    });

    it('should support multiple prerequisites', () => {
      const formNodeData: FormNodeData = {
        id: 'form-2',
        component_key: 'key-2',
        component_type: 'form',
        component_id: 'comp-2',
        name: 'Form 2',
        prerequisites: ['form-1', 'form-1a'],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: 'minutes' },
        approval_required: false,
        approval_roles: [],
      };

      expect(formNodeData.prerequisites).toHaveLength(2);
      expect(formNodeData.prerequisites).toContain('form-1');
    });

    it('should support role-based access', () => {
      const formNodeData: FormNodeData = {
        id: 'form-1',
        component_key: 'key-1',
        component_type: 'form',
        component_id: 'comp-1',
        name: 'Test Form',
        prerequisites: [],
        permitted_roles: ['admin', 'user', 'manager'],
        input_mapping: {},
        sla_duration: { number: 0, unit: 'minutes' },
        approval_required: true,
        approval_roles: ['admin'],
      };

      expect(formNodeData.permitted_roles).toHaveLength(3);
      expect(formNodeData.approval_roles).toHaveLength(1);
    });

    it('should support input mapping', () => {
      const formNodeData: FormNodeData = {
        id: 'form-1',
        component_key: 'key-1',
        component_type: 'form',
        component_id: 'comp-1',
        name: 'Test Form',
        prerequisites: ['form-0'],
        permitted_roles: [],
        input_mapping: {
          email: 'form-0.email',
          name: 'form-0.name',
          phone: 'form-0.phone',
        },
        sla_duration: { number: 0, unit: 'minutes' },
        approval_required: false,
        approval_roles: [],
      };

      expect(Object.keys(formNodeData.input_mapping)).toHaveLength(3);
      expect(formNodeData.input_mapping.email).toBe('form-0.email');
    });
  });

  describe('FieldSchema', () => {
    it('should define properties and required fields', () => {
      const fieldSchema: FieldSchema = {
        type: 'object',
        properties: {
          email: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'Email',
            format: 'email',
          },
          name: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'Name',
          },
        },
        required: ['email', 'name'],
      };

      expect(fieldSchema.type).toBe('object');
      expect(fieldSchema.required).toContain('email');
      expect(Object.keys(fieldSchema.properties)).toHaveLength(2);
    });
  });

  describe('UiSchema', () => {
    it('should contain UI elements configuration', () => {
      const element: Element = {
        type: 'Control',
        scope: '#/properties/email',
        label: 'Email Address',
        options: { format: 'email' },
      };

      const uiSchema: UiSchema = {
        type: 'VerticalLayout',
        elements: [element],
      };

      expect(uiSchema.elements).toHaveLength(1);
      expect(uiSchema.elements[0].label).toBe('Email Address');
      expect(uiSchema.elements[0].options?.format).toBe('email');
    });
  });

  describe('FormType', () => {
    it('should combine all schema definitions', () => {
      const form: FormType = {
        id: 'form-1',
        name: 'Customer Form',
        description: 'Collect customer information',
        is_reusable: true,
        field_schema: {
          type: 'object',
          properties: {
            email: {
              avantos_type: 'short-text',
              type: 'string',
              title: 'Email',
              format: 'email',
            },
          },
          required: ['email'],
        },
        ui_schema: {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/email',
              label: 'Email',
            },
          ],
        },
        dynamic_field_config: {
          button: {
            selector_field: 'button',
            payload_fields: { userId: { type: 'string', value: '123' } },
            endpoint_id: 'endpoint-1',
          },
          dynamic_checkbox_group: {
            items: { enum: ['opt1'], type: 'string' },
            type: 'array',
            uniqueItems: true,
          },
          dynamic_object: {
            enum: [],
            title: 'Object',
            type: 'object',
          },
        },
      };

      expect(form.name).toBe('Customer Form');
      expect(form.is_reusable).toBe(true);
      expect(form.field_schema.required).toContain('email');
      expect(form.ui_schema.elements).toHaveLength(1);
    });
  });

  describe('DynamicFieldConfig', () => {
    it('should support button configuration', () => {
      const config: DynamicFieldConfig = {
        button: {
          selector_field: 'action_button',
          payload_fields: {
            userId: { type: 'string', value: 'user123' },
            action: { type: 'string', value: 'submit' },
          },
          endpoint_id: 'submit-endpoint',
        },
        dynamic_checkbox_group: {
          items: { enum: [], type: 'string' },
          type: 'array',
          uniqueItems: true,
        },
        dynamic_object: {
          enum: [],
          title: 'Config',
          type: 'object',
        },
      };

      expect(config.button.selector_field).toBe('action_button');
      expect(Object.keys(config.button.payload_fields)).toHaveLength(2);
    });

    it('should support checkbox group with enums', () => {
      const config: DynamicFieldConfig = {
        button: {
          selector_field: 'btn',
          payload_fields: {},
          endpoint_id: 'ep-1',
        },
        dynamic_checkbox_group: {
          items: {
            enum: ['option1', 'option2', 'option3'],
            type: 'string',
          },
          type: 'array',
          uniqueItems: true,
        },
        dynamic_object: {
          enum: [],
          title: 'Obj',
          type: 'object',
        },
      };

      expect(config.dynamic_checkbox_group.items.enum).toHaveLength(3);
      expect(config.dynamic_checkbox_group.uniqueItems).toBe(true);
    });
  });

  describe('Type Validation', () => {
    it('should maintain type safety across transformations', () => {
      const nodeData: FormNodeData = {
        id: 'form-1',
        component_key: 'key-1',
        component_type: 'form',
        component_id: 'comp-1',
        name: 'Test',
        prerequisites: [],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: 'minutes' },
        approval_required: false,
        approval_roles: [],
      };

      const form: FormType = {
        id: nodeData.id,
        name: nodeData.name,
        description: 'Test form',
        is_reusable: false,
        field_schema: {
          type: 'object',
          properties: {},
          required: [],
        },
        ui_schema: {
          type: 'VerticalLayout',
          elements: [],
        },
        dynamic_field_config: {
          button: {
            selector_field: '',
            payload_fields: {},
            endpoint_id: '',
          },
          dynamic_checkbox_group: {
            items: { enum: [], type: 'string' },
            type: 'array',
            uniqueItems: false,
          },
          dynamic_object: {
            enum: [],
            title: '',
            type: 'object',
          },
        },
      };

      expect(form.id).toBe(nodeData.id);
      expect(form.name).toBe(nodeData.name);
    });
  });
});
