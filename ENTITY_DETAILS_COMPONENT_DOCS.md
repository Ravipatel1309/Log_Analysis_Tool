# Entity Details Table Components Documentation

## Overview

This document describes the new entity details components added to the Log Insights Hub application. These components provide a professional, production-ready interface for displaying entity metadata and synchronization history.

## Components

### 1. EntityDetailsTable Component

**File:** `src/components/dashboard/EntityDetailsTable.tsx`

A comprehensive React component that displays entity information and sync status history in a clean, organized layout.

#### Features

- **Main Entity Details Card**: Displays key entity metadata in a grid layout
  - Source Entity ID
  - System (displayed as a badge)
  - Entity Type (displayed as a badge)
  - Entity Creation Time

- **Sync Status History Card**: Shows a table of entity synchronization revisions
  - Revision ID (as badge)
  - Start Sync Time
  - Finished Sync Time
  - Source Event XML (with View button)
  - Transformed Event XML (with View button)
  - Revision count badge

- **XML Viewer Integration**: Clicking "View" buttons opens the XMLViewerModal for detailed XML inspection

#### Props

```typescript
interface EntityDetailsTableProps {
  entityDetails: EntityDetails;
}
```

#### Usage

```tsx
import { EntityDetailsTable } from '@/components/dashboard/EntityDetailsTable';
import { getMockEntityDetails } from '@/mockData/entityDetails';

export function MyComponent() {
  return (
    <EntityDetailsTable entityDetails={getMockEntityDetails()} />
  );
}
```

#### Styling

- Uses shadcn/ui components (Card, Table, Badge, Button)
- Responsive grid layout (2 columns for entity details)
- Hover effects on table rows
- Professional Grafana/Datadog-inspired design
- Proper spacing and typography for readability

### 2. XMLViewerModal Component (Enhanced)

**File:** `src/components/dashboard/XMLViewerModal.tsx`

Existing modal component for displaying formatted XML content.

#### Features

- Modal dialog with title and close button
- Formatted XML with proper indentation
- Scrollable content area
- Monospace font for code readability
- Copy functionality (via existing implementation)
- Toast notifications for user feedback

#### Props

```typescript
interface XMLViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  xmlContent: string;
}
```

## Data Models

### EntityDetails Interface

**File:** `src/types/index.ts`

```typescript
export interface EntityDetails {
  sourceEntityId: string;        // Unique identifier for the entity
  system: string;                // Source system (e.g., "CA PPM")
  entityType: string;             // Type of entity (e.g., "Task")
  entityCreationTime: string;     // Timestamp of entity creation
  syncStatusList: SyncStatus[];  // Array of sync revisions
}
```

### SyncStatus Interface

**File:** `src/types/index.ts`

```typescript
export interface SyncStatus {
  revisionId: number;            // Sequential revision number
  startSyncTime: string;         // When sync started
  finishedSyncTime: string;      // When sync completed
  sourceEventXML: string;        // Original XML from source system
  transformedEventXML: string;   // Transformed XML after processing
}
```

## Mock Data

**File:** `src/mockData/entityDetails.ts`

Provides sample entity details with 3 revisions showing:
- Initial sync (In Progress → Completed)
- Status update sync (completion confirmation)
- Final approval sync

### Usage

```typescript
import { getMockEntityDetails } from '@/mockData/entityDetails';

const entityData = getMockEntityDetails();
```

## Integration with Dashboard

The EntityDetailsTable is integrated into the Dashboard page between the LifecycleChart and EventXMLTable sections.

**File:** `src/pages/Dashboard.tsx`

```tsx
import { EntityDetailsTable } from '@/components/dashboard/EntityDetailsTable';
import { getMockEntityDetails } from '@/mockData/entityDetails';

// In Dashboard component render:
<EntityDetailsTable entityDetails={getMockEntityDetails()} />
```

## Backend Integration Notes

### Ready for API Integration

The current implementation uses mock data but is fully prepared for backend integration:

1. **Replace Mock Data**: Update `getMockEntityDetails()` to fetch from an API endpoint
   ```typescript
   export async function getEntityDetails(entityId: string): Promise<EntityDetails> {
     const response = await fetch(`/api/entities/${entityId}`);
     return response.json();
   }
   ```

2. **Error Handling**: Add error states to EntityDetailsTable
   ```typescript
   interface EntityDetailsTableProps {
     entityDetails: EntityDetails | null;
     isLoading?: boolean;
     error?: string;
   }
   ```

3. **Async Data Loading**: Implement useEffect in Dashboard to fetch data
   ```typescript
   useEffect(() => {
     fetchEntityDetails(testcaseId);
   }, [testcaseId]);
   ```

### Expected API Response Format

```json
{
  "sourceEntityId": "5223407",
  "system": "CA PPM",
  "entityType": "Task",
  "entityCreationTime": "2026-01-29 23:30:17.828+05:30",
  "syncStatusList": [
    {
      "revisionId": 1,
      "startSyncTime": "2026-01-30 08:15:22.451+05:30",
      "finishedSyncTime": "2026-01-30 08:15:45.892+05:30",
      "sourceEventXML": "<?xml version=\"1.0\"?>...",
      "transformedEventXML": "<?xml version=\"1.0\"?>..."
    }
  ]
}
```

## Component Architecture

### Separation of Concerns

1. **EntityDetailsTable** (`EntityDetailsTable.tsx`)
   - Responsible for UI rendering
   - State management for XML modal
   - Handles user interactions (View buttons)

2. **XMLViewerModal** (`XMLViewerModal.tsx`)
   - Responsible for XML display
   - Formatting and copy functionality
   - Modal dialog management

3. **Data Models** (`types/index.ts`)
   - Type-safe interfaces
   - Backend contract definition

4. **Mock Data** (`mockData/entityDetails.ts`)
   - Development and testing data
   - Realistic sample values
   - Easy to replace with API calls

## Styling Guide

### Color Scheme

- **Background**: `bg-slate-50` (light gray)
- **Borders**: `border-slate-200` (light border)
- **Text**: `text-slate-900` (dark text), `text-slate-500` (muted labels)
- **Badges**:
  - System: `bg-slate-50` (outline style)
  - Entity Type: `bg-slate-100` (secondary style)
  - Revision Count: `bg-blue-50` with `text-blue-700` (accent)

### Responsive Design

- 2-column grid for entity details (adjustable for mobile)
- Horizontal scrolling for sync history table on small screens
- Proper padding and spacing throughout
- Mobile-friendly button sizing (size="sm" with h-8)

## Testing

### Test Scenarios

1. **Render with mock data**: Verify all fields display correctly
2. **XML viewer**: Click View buttons and confirm modal opens with formatted XML
3. **Responsive layout**: Test on mobile, tablet, and desktop
4. **Empty state**: Handle cases with no sync history
5. **Large XML**: Test with very large XML strings

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import { EntityDetailsTable } from '@/components/dashboard/EntityDetailsTable';
import { getMockEntityDetails } from '@/mockData/entityDetails';

test('renders entity details correctly', () => {
  render(<EntityDetailsTable entityDetails={getMockEntityDetails()} />);
  
  expect(screen.getByText('5223407')).toBeInTheDocument();
  expect(screen.getByText('CA PPM')).toBeInTheDocument();
  expect(screen.getByText('Task')).toBeInTheDocument();
  expect(screen.getByText(/3 revisions/)).toBeInTheDocument();
});
```

## Future Enhancements

1. **Sorting**: Add column sorting for sync history table
2. **Filtering**: Filter revisions by date range or status
3. **Export**: Export entity details and XML as CSV or JSON
4. **Comparison**: Side-by-side XML comparison view
5. **Pagination**: Handle entities with many revisions
6. **Search**: Search within sync history
7. **Real-time updates**: WebSocket integration for live sync status
8. **Audit trail**: Add user information and change tracking

## Troubleshooting

### XMLViewerModal not opening

- Ensure XMLViewerModal is imported correctly in EntityDetailsTable
- Verify `selectedXml` state is being set properly
- Check browser console for errors

### XML formatting issues

- XML must be valid; malformed XML will display unformatted
- Special characters must be properly escaped
- Use CDATA sections for content with markup

### Styling inconsistencies

- Verify Tailwind CSS is properly configured
- Check that shadcn/ui components are installed
- Ensure CSS classes are not being overridden elsewhere

## Files Modified/Created

- ✅ Created: `src/components/dashboard/EntityDetailsTable.tsx`
- ✅ Created: `src/mockData/entityDetails.ts`
- ✅ Updated: `src/types/index.ts` (added EntityDetails, SyncStatus interfaces)
- ✅ Updated: `src/pages/Dashboard.tsx` (integrated EntityDetailsTable)
- ✅ Existing: `src/components/dashboard/XMLViewerModal.tsx` (used for XML display)

## Summary

The EntityDetailsTable component provides a professional, production-ready interface for displaying entity metadata and synchronization history. It's fully typed, easily testable, and prepared for backend API integration while currently using realistic mock data for development.
