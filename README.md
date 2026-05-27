# Avantos - Journey Challenge Blueprint System

[![Next.js](https://img.shields.io/badge/Next.js-15.5.18-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.6-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3.0-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Component Guide](#component-guide)
- [State Management](#state-management)
- [Recursive Functions](#recursive-functions)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

**Avantos** is a Next.js-based blueprint system for managing complex form workflows and customer journeys. It provides a visual interface to create, manage, and execute multi-step forms with dependencies, prerequisites, role-based permissions, and SLA tracking.

The system allows organizations to:

- Define sequential form workflows as directed acyclic graphs (DAGs)
- Set form dependencies and prerequisites
- Manage role-based access control
- Track form completion SLAs
- Support dynamic field mapping and inheritance
- Visualize workflow progression in real-time

## ✨ Features

- **Visual Flow Builder**: Interactive graph-based UI for workflow visualization using XYFlow
- **Form Dependencies**: Define prerequisites between forms with automatic dependency resolution
- **Dynamic Field Rendering**: Support for multiple field types (text, email, checkbox groups, object enums, buttons)
- **Field Inheritance**: Enable data flow from prerequisite forms to dependent forms
- **Context-Based State Management**: Global state for forms, nodes, and field selection
- **Server-Side Data Fetching**: Next.js App Router with Suspense support
- **Type-Safe Development**: Full TypeScript support with strict type checking
- **Responsive UI**: Mobile-friendly components with Tailwind CSS
- **Dark Mode Support**: Theme switching with next-themes
- **Real-Time Validation**: Valibot-powered field validation
- **REST API**: Fetch blueprint graphs with dynamic routing

## 🛠 Tech Stack

### Core Framework

- **Next.js** 15.5.18 - React framework with App Router
- **React** 19.2.6 - UI library
- **TypeScript** 5.9.2 - Type safety

### UI & Styling

- **Tailwind CSS** 4.3.0 - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **Lucide React** 1.16.0 - Icon library
- **Radix UI** 1.4.3 - Unstyled, accessible component primitives
- **next-themes** 0.4.6 - Theme management

### Visualization & Forms

- **@xyflow/react** 12.10.2 - Graph visualization library
- **Valibot** 1.4.1 - Schema validation
- **Sonner** 2.0.7 - Toast notifications

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Node.js** - Runtime environment

## 📁 Project Structure

```
avantos/
├── app/                              # Next.js App Router
│   ├── api/
│   │   └── v1/
│   │       └── [projectId]/
│   │           └── actions/
│   │               └── blueprints/
│   │                   └── [blueprintId]/
│   │                       └── graph/
│   │                           └── route.ts          # GET blueprint graph API
│   ├── context/
│   │   └── index.tsx                 # Global form context provider
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Global styles
│   └── not-found.tsx                 # 404 page
├── components/
│   ├── flows/
│   │   ├── flow.tsx                  # Main flow component
│   │   ├── form-node.tsx             # Form node representation
│   │   ├── graph.tsx                 # Graph server component
│   │   └── index.tsx                 # Exports
│   ├── prefill/
│   │   ├── dynamic-renderer.tsx       # Dynamic field renderer
│   │   └── index.tsx                 # Exports
│   ├── sidebar/
│   │   ├── index.tsx                 # Sidebar exports
│   │   └── inherited-component.tsx    # Sidebar implementation
│   └── ui/                           # Shadcn UI components
│       ├── button.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── field.tsx
│       ├── input.tsx
│       ├── input-group.tsx
│       ├── label.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
├── hooks/
│   └── use-mobile.ts                 # Mobile detection hook
├── lib/
│   └── utils.ts                      # Utility functions
├── public/                           # Static assets
├── server/
│   ├── index.js                      # Standalone server (optional)
│   ├── graph.json                    # Sample blueprint graph data
│   └── package.json
├── types/
│   └── index.ts                      # TypeScript type definitions
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.mjs                # PostCSS config
├── eslint.config.mjs                 # ESLint config
└── README.md                         # This file
```

## 🏗 Architecture

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
├─────────────────────────────────────────────────────────┤
│  Next.js App Router (React Components)                   │
│  ├── Suspense Boundary                                   │
│  └── Form Flow Visualization                             │
├─────────────────────────────────────────────────────────┤
│  Context API (State Management)                          │
│  ├── FormNodeProvider                                    │
│  ├── Current Form State                                  │
│  ├── Dependency Map                                      │
│  └── Field Selection                                     │
├─────────────────────────────────────────────────────────┤
│  XYFlow Components (Graph Visualization)                 │
│  ├── Nodes (FormNode)                                    │
│  ├── Edges (Connections)                                 │
│  └── Handles (Connection Points)                         │
└──────────────────────┬──────────────────────────────────┘
                       │ Fetch Request
                       ↓
┌─────────────────────────────────────────────────────────┐
│              Next.js API Route Handler                   │
│       /api/v1/[projectId]/actions/blueprints/[blueprintId]/graph
├─────────────────────────────────────────────────────────┤
│  File System Operations (fs/promises)                    │
│  ├── Read graph.json                                     │
│  ├── Parse JSON                                          │
│  └── Return Response                                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│         File System / Data Store                         │
│  └── server/graph.json (Blueprint Definition)            │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
Home (page.tsx)
  └── Suspense
      └── GraphContent (graph.tsx - Server Component)
          └── Flow (flow.tsx - Client Component)
              ├── ReactFlow
              │   ├── FormNode (formNodeType nodes)
              │   ├── Edges
              │   └── Controls
              ├── Dialog (from shadcn/ui)
              │   └── PrefillDialog
              │       └── DynamicRenderer
              │           ├── Input fields
              │           ├── Checkboxes
              │           └── Validation
              └── FormNodeProvider Context
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd avantos
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory:

```env
# Server Configuration
NEXT_APP_URL=http://localhost:3000

# Blueprint Configuration
NEXT_PUBLIC_PROJECT_ID=project123
NEXT_PUBLIC_BLUEPRINT_ID=blueprint456
```

4. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Build & Production

**Build the application:**

```bash
npm run build
```

**Start production server:**

```bash
npm start
```

## ⚙️ Configuration

### Environment Variables

| Variable                   | Description               | Default                 |
| -------------------------- | ------------------------- | ----------------------- |
| `NEXT_APP_URL`             | Base URL for API requests | `http://localhost:3000` |
| `NEXT_PUBLIC_PROJECT_ID`   | Project identifier        | `project123`            |
| `NEXT_PUBLIC_BLUEPRINT_ID` | Blueprint identifier      | `blueprint456`          |

### Next.js Configuration

The `next.config.ts` provides webpack fallbacks for browser-incompatible modules:

```typescript
webpack: config => {
  config.resolve.fallback = {
    fs: false,
    path: false,
  };
  return config;
};
```

## 📡 API Documentation

### Blueprint Graph Endpoint

**Fetch blueprint workflow graph data**

```
GET /api/v1/{projectId}/actions/blueprints/{blueprintId}/graph
```

#### Parameters

| Name          | Type   | Location | Required | Description          |
| ------------- | ------ | -------- | -------- | -------------------- |
| `projectId`   | string | path     | ✓        | Project identifier   |
| `blueprintId` | string | path     | ✓        | Blueprint identifier |

#### Response

Returns a JSON object containing the blueprint graph structure:

```typescript
{
  "id": "bp_01jk766tckfwx84xjcxazggzyc",
  "tenant_id": "1",
  "name": "Onboard Customer",
  "description": "Automated customer onboarding workflow",
  "category": "Customer Onboarding",
  "nodes": FormNodeType[],
  "edges": Edge[],
  "forms": FormType[]
}
```

#### Success Response (200 OK)

```json
{
  "id": "bp_01jk766tckfwx84xjcxazggzyc",
  "tenant_id": "1",
  "name": "Onboard Customer 0",
  "description": "Automated test action",
  "category": "Category 4",
  "nodes": [
    {
      "id": "form-bad163fd-09bd-4710-ad80-245f31b797d5",
      "position": { "x": 1437, "y": 264 },
      "type": "form",
      "data": {
        "id": "bp_c_01jka1e3jwewhb2177h7901c5j",
        "component_key": "form-bad163fd-09bd-4710-ad80-245f31b797d5",
        "component_type": "form",
        "component_id": "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        "name": "Form F",
        "prerequisites": ["form-0f58384c-4966-4ce6-9ec2-40b96d61f745"],
        "permitted_roles": [],
        "input_mapping": {},
        "sla_duration": { "number": 0, "unit": "minutes" },
        "approval_required": false,
        "approval_roles": []
      }
    }
  ],
  "edges": [
    {
      "source": "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
      "target": "form-a4750667-d774-40fb-9b0a-44f8539ff6c4"
    }
  ],
  "forms": []
}
```

#### Error Response (404 Not Found)

```json
{
  "error": "Failed to load graph data"
}
```

#### Usage Example

```typescript
const API_BASE_URL = process.env.NEXT_APP_URL || 'http://localhost:3000';
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'project123';
const BLUEPRINT_ID = process.env.NEXT_PUBLIC_BLUEPRINT_ID || 'blueprint456';

const url = `${API_BASE_URL}/api/v1/${PROJECT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph`;

const response = await fetch(url, {
  next: { revalidate: 3600 }, // ISR: revalidate every hour
});

if (!response.ok) {
  throw new Error(`API Error: ${response.status}`);
}

const graphData = await response.json();
```

## 🧩 Component Guide

### Flow Component

**Location:** `components/flows/flow.tsx`

Main client-side component that renders the interactive graph workflow visualization.

**Key Functions:**

- `drawNodes(nodes: FormNodeType[], onClick?)` - Converts form nodes into XYFlow nodes
- `drawEdge(source: FormNodeType, target: FormNodeType)` - Creates edge connections
- `dependencyMap(nodeMap: Record<string, FormNodeType>)` - Maps form prerequisites
- `traverseNode(nodes: FormNodeType[], edges: Edge[])` - Processes nodes and edges

**Props:**

```typescript
type FlowProps = {
  data: {
    nodes: FormNodeType[];
    edges: Edge[];
    forms: [];
  };
};
```

**Features:**

- Suspense support for async data fetching
- Incremental Static Regeneration (ISR) with 1-hour cache
- Error boundary with user-friendly messages

### FormNode Component

**Location:** `components/flows/form-node.tsx`

Represents individual form steps in the workflow graph.

**Type Definition:**

```typescript
export type FormNodeData = {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[]; // Form IDs that must be completed first
  permitted_roles: string[]; // Roles allowed to access this form
  input_mapping: Record<string, string>; // Field mappings from prerequisites
  sla_duration: SlaDuration; // Service level agreement timing
  approval_required: boolean; // Whether approval is needed
  approval_roles: string[]; // Roles that can approve
};
```

**Visual Features:**

- Form icon with purple background
- Form name and type label
- Four connection handles (source/target on left and right)
- Interactive click handlers for form selection

### DynamicRenderer Component

**Location:** `components/prefill/dynamic-renderer.tsx`

Dynamically renders form fields based on schema and provides real-time validation.

**Supported Field Types:**

- `short-text` - Text input with optional format constraints (email)
- `dynamic-checkbox-group` - Multiple selection with enum values
- `object-enum` - Dropdown selection from enum values
- `button` - Action buttons with payload

**Features:**

- Field validation using Valibot schemas
- Inherited field indicator and reset functionality
- Click-to-attach field mapping for prerequisites
- Real-time validation feedback

**Props:**

```typescript
type DynamicRendererProps = {
  type: AvantosType;
  title: string;
  format?: 'email';
  inherited?: boolean;
  inheritFrom?: string;
  form: FormType;
  // ... callbacks
};
```

### GraphContent Component

**Location:** `components/flows/graph.tsx`

Server-side component that fetches and manages blueprint graph data.

**Key Operations:**

- Server-side data fetching from API
- Suspense boundary management
- Error handling with user-friendly messages
- ISR cache revalidation every 3600 seconds (1 hour)

## 🔄 State Management

### FormNodeProvider Context

**Location:** `app/context/index.tsx`

Global context for managing form workflow state using React Context API.

**Context State:**

```typescript
{
  explorer: boolean; // Show/hide field explorer
  currentForm: CurrentFormType | null; // Currently editing form
  dependencyMap: DependencyMapType | null; // Form prerequisites mapping
  currentNode: FormNodeType | null; // Selected form node
  attachedField: AttachedFieldType | null; // Field being attached
  selectedField: SelectedFieldType | null; // Selected field details
}
```

**Available Hooks:**

```typescript
// Get current node selection
const currentNode = useCurrentNode();

// Get field selection and dependencies
const { dependencyMap, selectedField, handleFieldClick } = useSelectedFieldContext();

// Get attached field context
const { attachedField, selectedField, ... } = useAttachFieldContext();

// Get explorer visibility toggle
const { explorer, toggleExplorer } = useExplorer();

// Get current form and field operations
const { currentForm, clearField, updateCurrentForm } = useCurrentForm();

// Get all form context operations
const { handleNodeClick, updateDependencies, resetForm, ... } = useFormNode();
```

**Context Functions:**

| Function                           | Purpose                     |
| ---------------------------------- | --------------------------- |
| `handleNodeClick(node)`            | Select a form node          |
| `handleAttachFieldClick(field)`    | Select field for attachment |
| `handleFieldClick(fieldKey, form)` | Select field from form      |
| `updateCurrentForm(form)`          | Update current form data    |
| `updateDependencies(map)`          | Set dependency mapping      |
| `clearField(fieldKey)`             | Clear field value           |
| `resetForm()`                      | Reset all form state        |
| `toggleExplorer(show)`             | Toggle field explorer       |

## 🔁 Recursive Functions

### dependencyMap()

**Location:** `components/flows/flow.tsx` (lines 73-90)

**Purpose:** Builds a dependency map showing which prerequisite forms feed into each form.

**Function Signature:**

```typescript
function dependencyMap(
  nodeMap: Record<string, FormNodeType>
): Record<string, Record<string, FormNodeType>>;
```

**Algorithm:**

```
1. Extract all nodes from the node map
2. For each node:
   a. Get its prerequisites array
   b. For each prerequisite ID:
      - Look up the prerequisite node in nodeMap
      - Add it to a prerequisite map
   c. Store the prerequisite map in the main dependency map
3. Return the complete dependency mapping
```

**Time Complexity:** O(n + p) where n = nodes, p = prerequisites
**Space Complexity:** O(n \* p) for storing all mappings

**Example Output:**

```javascript
{
  "form-bad163fd...": {
    "form-0f58384c...": { /* FormNodeType */ },
    "form-e15d42df...": { /* FormNodeType */ }
  },
  "form-a4750667...": {
    "form-47c61d17...": { /* FormNodeType */ }
  }
}
```

### traverseNode()

**Location:** `components/flows/flow.tsx` (lines 91-121)

**Purpose:** Processes nodes and edges, building connection data for visualization.

**Function Signature:**

```typescript
function traverseNode(
  nodes: FormNodeType[],
  edges: Edge[] = []
): {
  nodeMap: Record<string, FormNodeType>;
  edges: any[];
};
```

**Algorithm:**

```
1. Initialize empty edges array and node map
2. Build node map:
   a. Iterate through nodes
   b. Store each node with its ID as key
3. Process edges:
   a. For each edge definition (source, target):
      - Look up source node in map
      - Look up target node in map
      - If both exist, call drawEdge() to create visualization edge
      - Add to edges array
4. Return both node map and processed edges
```

**Time Complexity:** O(n + e) where n = nodes, e = edges
**Space Complexity:** O(n + e)

**Visual Connection:**

```
Edge Data Format:
{
  id: "e{source_id}-{target_id}",
  source: "form-47c61d17...",
  sourceHandle: "a",
  target: "form-a4750667...",
  targetHandle: "c"
}
```

### drawNodes()

**Location:** `components/flows/flow.tsx` (lines 46-71)

**Purpose:** Converts form data into XYFlow-compatible node objects, organizing by prerequisites.

**Function Signature:**

```typescript
function drawNodes(nodes: FormNodeType[], onClick?: (node: FormNodeType) => void): Node[];
```

**Algorithm:**

```
1. Initialize empty array for ReactFlow nodes
2. For each form node:
   a. If node has NO prerequisites:
      - Add to BEGINNING of array (unshift)
   b. If node HAS prerequisites:
      - Add to END of array (push)
3. For each node, create ReactFlow Node object with:
   - ID, type, position, onClick handler
4. Return array of ReactFlow nodes
```

**Purpose of Ordering:** Root forms (no prerequisites) render first, creating visual hierarchy.

**Time Complexity:** O(n) where n = nodes
**Space Complexity:** O(n)

## 🎨 Using the Application

### Workflow Visualization

1. **Load Page**: Visit [http://localhost:3000](http://localhost:3000)
2. **View Graph**: Blueprint forms display as interactive nodes
3. **Node Details**: Click any form node to see its properties
4. **Dependencies**: Edges show form prerequisites and flow
5. **Zoom/Pan**: Use mouse wheel and drag to navigate large graphs

### Form Navigation & Data Entry

1. **Select Form**: Click a form node to open its dialog
2. **View Prerequisites**: Check which forms must be completed first
3. **Enter Data**: Fill in required fields with validation
4. **Field Inheritance**: Previously entered data auto-fills based on mappings
5. **Submit**: Complete form and move to next steps

### Field Mapping

1. **Click Field**: Select a field in the current form
2. **Explorer Opens**: View available fields from prerequisite forms
3. **Map Field**: Click source field to inherit its value
4. **Visual Indicator**: Inherited fields show a clear button
5. **Reset**: Clear inherited values with the X button

### Data Flow Example

```
Form A (No Prerequisites)
  ↓ (Complete and save)
  ├─→ Data stored in context
  ↓
Form C & Form D (Both require Form A)
  ├─→ Form C and D can inherit fields from Form A
  ├─→ Auto-fill email, customer ID, etc.
  ↓ (Complete and save both)
Form F (Requires Form C & D)
  ├─→ Form F inherits from both C and D
  ├─→ Consolidated customer data
  ↓ Final submission
```

## 🚀 Development Workflow

### Code Style

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Enforce code quality standards
- **Tailwind CSS**: Utility-first CSS methodology
- **Component-Driven**: Modular, reusable component architecture

### Adding New Form Field Types

1. Add type to `AvantosType` in [types/index.ts](types/index.ts)
2. Update `FieldSchema` interface with new field definition
3. Add rendering case in [components/prefill/dynamic-renderer.tsx](components/prefill/dynamic-renderer.tsx)
4. Create validation schema if needed (Valibot)

### Extending the API

1. Create new route file in `app/api/v1/...`
2. Export named handler functions (GET, POST, PUT, DELETE)
3. Implement request handling with proper error responses
4. Add type definitions in [types/index.ts](types/index.ts)

### Adding New Components

1. Create `.tsx` file in appropriate `components/` subdirectory
2. Use functional components with React hooks
3. Export from index.tsx in the directory
4. Wrap in `"use client"` if using client-side hooks
5. Add TypeScript prop types

## 📦 Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub/GitLab/Bitbucket
2. Import project on [Vercel](https://vercel.com)
3. Configure environment variables:
   - `NEXT_APP_URL=https://your-domain.com`
   - `NEXT_PUBLIC_PROJECT_ID=your-project-id`
   - `NEXT_PUBLIC_BLUEPRINT_ID=your-blueprint-id`
4. Deploy automatically on push

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t avantos:latest .
docker run -p 3000:3000 -e NEXT_APP_URL=http://localhost:3000 avantos:latest
```

### Self-Hosted (Linux/Ubuntu)

1. Install Node.js 18+
2. Clone repository
3. Install dependencies: `npm ci --only=production`
4. Build: `npm run build`
5. Set environment variables
6. Start: `npm start`
7. Use process manager (PM2, systemd) for persistence

## 🐛 Troubleshooting

### Common Issues

**Issue: "Failed to load graph data"**

- Check if `/server/graph.json` exists
- Verify `NEXT_PUBLIC_PROJECT_ID` and `NEXT_PUBLIC_BLUEPRINT_ID` match graph file
- Check browser console for detailed error

**Issue: Forms not appearing in graph**

- Ensure graph.json has valid `nodes` array
- Check node type is `"form"`
- Verify node has required `data` properties

**Issue: Field validation fails**

- Review Valibot schema in `dynamic-renderer.tsx`
- Email validation requires valid email format
- Check field `format` property matches validation rule

**Issue: Context state not updating**

- Verify component is wrapped in `FormNodeProvider`
- Check [app/layout.tsx](app/layout.tsx) includes provider
- Use correct hook for desired context (useFormNode, useCurrentForm, etc.)

**Issue: Graph rendering slowly**

- Large graphs (100+ nodes) may have performance impact
- Increase ISR revalidation interval in [components/flows/graph.tsx](components/flows/graph.tsx)
- Consider pagination or filtering of nodes

### Debug Mode

Enable detailed logging in development:

```typescript
// components/flows/graph.tsx
const response = await fetch(url, {
  next: { revalidate: 3600 },
});

console.log('Fetch URL:', url);
console.log('Response Status:', response.status);
console.log('Response Data:', await response.json());
```

### Performance Optimization

1. **Code Splitting**: Next.js automatically splits code per route
2. **Image Optimization**: Use Next.js Image component
3. **Lazy Loading**: Use React.lazy() for heavy components
4. **Caching**: ISR configured for graph endpoint
5. **Compression**: Gzip enabled by default

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [XYFlow Documentation](https://xyflow.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Valibot Documentation](https://valibot.dev)
- [Shadcn/ui Components](https://ui.shadcn.com)

## 📄 License

This project is private and proprietary. Unauthorized copying or distribution is prohibited.

## 👥 Contributing

Internal development only. Contact the development team for contribution guidelines.

---

**Last Updated:** January 2025  
**Version:** 0.1.0  
**Project Name:** Avantos - Journey Challenge Blueprint System
