/**
 * EventXMLTable - Table displaying source and transformed XML events
 * With View buttons that open modal dialogs
 */

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { EventXMLData } from '@/types';
import { XMLViewerModal } from './XMLViewerModal';
import { formatTimestamp } from '@/utils/formatters';

interface EventXMLTableProps {
  data: EventXMLData[];
  isLoading?: boolean;
}

type XMLViewType = 'source' | 'transformed';

interface ModalState {
  isOpen: boolean;
  title: string;
  content: string;
}

/**
 * Table component for displaying XML event data
 * TODO: Replace with paginated API data
 */
export const EventXMLTable = ({ data, isLoading }: EventXMLTableProps) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    content: '',
  });

  const openXMLModal = (
    entityId: string,
    type: XMLViewType,
    content: string
  ) => {
    setModalState({
      isOpen: true,
      title: `${type === 'source' ? 'Source' : 'Transformed'} XML - ${entityId}`,
      content,
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-8">
        <div className="text-center text-muted-foreground">
          Loading event data...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Event XML Comparison</h3>
          <p className="text-sm text-muted-foreground">
            View source and transformed XML for each entity
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[150px]">Entity ID</TableHead>
              <TableHead className="w-[200px]">Timestamp</TableHead>
              <TableHead className="text-center">Source XML</TableHead>
              <TableHead className="text-center">Transformed XML</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((event) => (
              <TableRow key={event.entityId}>
                <TableCell className="font-mono text-sm">
                  {event.entityId}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatTimestamp(event.timestamp, 'HH:mm:ss')}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openXMLModal(event.entityId, 'source', event.sourceEventXML)
                    }
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openXMLModal(
                        event.entityId,
                        'transformed',
                        event.transformedEventXML
                      )
                    }
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <XMLViewerModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        xmlContent={modalState.content}
      />
    </>
  );
};
