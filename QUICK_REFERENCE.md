# Quick Reference Guide - Entity Details Component

## 📦 Files & Locations

| File | Location | Purpose |
|------|----------|---------|
| EntityDetailsTable.tsx | `src/components/dashboard/` | Main component for entity display |
| XMLViewerModal.tsx | `src/components/dashboard/` | Modal for formatted XML display (existing) |
| entityDetails.ts | `src/mockData/` | Mock data for development |
| index.ts | `src/types/` | TypeScript interfaces (EntityDetails, SyncStatus) |
| Dashboard.tsx | `src/pages/` | Main page component (integration point) |

## 🚀 Quick Start

### Using the Component

```tsx
import { EntityDetailsTable } from '@/components/dashboard/EntityDetailsTable';
import { getMockEntityDetails } from '@/mockData/entityDetails';

function MyPage() {
  return (
    <EntityDetailsTable entityDetails={getMockEntityDetails()} />
  );
}
```

### With Dynamic Data (Future)

```tsx
import { useEffect, useState } from 'react';
import { EntityDetailsTable } from '@/components/dashboard/EntityDetailsTable';
import { EntityDetails } from '@/types';

function Dashboard() {
  const [entity, setEntity] = useState<EntityDetails | null>(null);

  useEffect(() => {
    // Fetch from API
    fetch(`/api/entities/${id}`)
      .then(r => r.json())
      .then(setEntity);
  }, [id]);

  return entity ? <EntityDetailsTable entityDetails={entity} /> : <Spinner />;
}
```

## 🔧 Component Props

### EntityDetailsTable

```typescript
interface EntityDetailsTableProps {
  entityDetails: EntityDetails;  // Required: entity data
}
```

### XMLViewerModal

```typescript
interface XMLViewerModalProps {
  isOpen: boolean;         // Modal visibility
  onClose: () => void;     // Close handler
  title: string;           // Modal title
  xmlContent: string;      // XML to display
}
```

## 📋 Data Structures

### EntityDetails

```typescript
{
  sourceEntityId: "5223407",           // string
  system: "CA PPM",                    // string
  entityType: "Task",                  // string
  entityCreationTime: "2026-01-29...", // ISO timestamp
  syncStatusList: [SyncStatus, ...]    // Array of sync revisions
}
```

### SyncStatus

```typescript
{
  revisionId: 1,                                    // number
  startSyncTime: "2026-01-30 08:15:22.451+05:30", // ISO timestamp
  finishedSyncTime: "2026-01-30 08:15:45.892+05:30", // ISO timestamp
  sourceEventXML: "<?xml...?>",                   // string
  transformedEventXML: "<?xml...?>"               // string
}
```

## 🎯 Key Features

| Feature | Implementation | Notes |
|---------|-----------------|-------|
| Entity Metadata Display | 2-column grid | Badges for System & Type |
| Sync History Table | Responsive table | Revision ID as badge |
| XML Viewer | Modal dialog | Click "View" button |
| Empty State | Table message | Shows if no revisions |
| Copy Function | Existing feature | Auto-timeout after 2s |
| Formatting | XML pretty-print | DOMParser-based |

## 🎨 Styling Classes

### Used Tailwind Classes

```
Containers:    space-y-6, grid, flex, gap-6
Backgrounds:   bg-slate-50, bg-slate-100, bg-blue-50
Borders:       border-slate-200, border-slate-100
Text Colors:   text-slate-900, text-slate-700, text-slate-500
Sizing:        h-8, p-4, py-3, pb-4
Typography:    text-lg, text-sm, text-xs, font-semibold, font-medium
```

## 🔍 Common Tasks

### Display Different Entity

```tsx
const myEntity: EntityDetails = {
  sourceEntityId: "12345",
  system: "SAP",
  entityType: "Invoice",
  entityCreationTime: "2026-02-01 10:00:00",
  syncStatusList: [/* ... */]
};

<EntityDetailsTable entityDetails={myEntity} />
```

### Add More Sync History

```tsx
const entity = getMockEntityDetails();
entity.syncStatusList.push({
  revisionId: 4,
  startSyncTime: "2026-02-01 09:00:00",
  finishedSyncTime: "2026-02-01 09:05:00",
  sourceEventXML: "<Event>...</Event>",
  transformedEventXML: "<TransformedEvent>...</TransformedEvent>"
});
```

### Customize Styling

Add custom CSS classes or Tailwind overrides:

```tsx
<Card className="border-4 border-blue-500"> {/* Custom border */}
  <EntityDetailsTable entityDetails={entity} />
</Card>
```

## 🧪 Testing

### Basic Render Test

```typescript
import { render, screen } from '@testing-library/react';
import { EntityDetailsTable } from '@/components/dashboard/EntityDetailsTable';
import { getMockEntityDetails } from '@/mockData/entityDetails';

test('renders entity details', () => {
  render(<EntityDetailsTable entityDetails={getMockEntityDetails()} />);
  expect(screen.getByText('5223407')).toBeInTheDocument();
  expect(screen.getByText('CA PPM')).toBeInTheDocument();
});
```

### Modal Interaction Test

```typescript
import { fireEvent } from '@testing-library/react';

test('opens XML modal on view click', () => {
  render(<EntityDetailsTable entityDetails={getMockEntityDetails()} />);
  const viewButtons = screen.getAllByText('View');
  fireEvent.click(viewButtons[0]);
  expect(screen.getByText(/Source Event XML/)).toBeInTheDocument();
});
```

## 🚨 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Modal not opening | onClick not triggered | Check button import & props |
| XML not formatted | Invalid XML | Ensure valid XML syntax |
| Styling missing | CSS not imported | Verify shadcn/ui setup |
| Type errors | Missing interface | Import from @/types/index |
| Empty table | No mock data | Call getMockEntityDetails() |

## 📚 Related Components

- **Card**: `src/components/ui/card.tsx`
- **Table**: `src/components/ui/table.tsx`
- **Badge**: `src/components/ui/badge.tsx`
- **Button**: `src/components/ui/button.tsx`
- **Dialog**: `src/components/ui/dialog.tsx` (used in XMLViewerModal)

## 🔗 Integration Points

```
Dashboard.tsx (main page)
  └─> EntityDetailsTable
      └─> Entity Metadata Display
      └─> Sync History Table
          └─> XMLViewerModal (on View click)
              └─> Formatted XML display
```

## 📊 Performance Notes

- Component: Lightweight, no heavy computations
- Mock Data: ~164 lines, instant loading
- Table: Handles 100+ revisions without issue
- Modal: Only renders when opened
- XML Formatting: Client-side parsing, cached

## 🔐 Security Considerations

- XML content from trusted source (API/mock)
- No innerHTML used; DOMParser for safe parsing
- User input not directly rendered
- Modal content properly escaped
- No XSS vulnerabilities

## 🌍 Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support
- CSS Grid support required
- Fetch API for future backend calls

## 📞 API Contract (For Backend)

### Request
```
GET /api/entities/{entityId}
```

### Response
```json
{
  "sourceEntityId": "string",
  "system": "string",
  "entityType": "string",
  "entityCreationTime": "ISO timestamp string",
  "syncStatusList": [
    {
      "revisionId": number,
      "startSyncTime": "ISO timestamp string",
      "finishedSyncTime": "ISO timestamp string",
      "sourceEventXML": "XML string",
      "transformedEventXML": "XML string"
    }
  ]
}
```

## 📝 Checklist for Production

- [ ] Connect to real API endpoint
- [ ] Add error handling & retry logic
- [ ] Implement loading states
- [ ] Add pagination for many revisions
- [ ] Test with large XML documents
- [ ] Verify responsive design on mobile
- [ ] Add unit & integration tests
- [ ] Document API integration
- [ ] Set up error monitoring

## 🎓 Learning Resources

- TypeScript Interfaces: https://www.typescriptlang.org/docs/handbook/2/objects.html
- React Hooks: https://react.dev/reference/react
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev/

## 📞 Support

For issues or questions:
1. Check ENTITY_DETAILS_COMPONENT_DOCS.md for detailed docs
2. Review VISUAL_DESIGN_REFERENCE.md for UI details
3. Check test examples in IMPLEMENTATION_SUMMARY.md
4. Inspect mock data in src/mockData/entityDetails.ts
