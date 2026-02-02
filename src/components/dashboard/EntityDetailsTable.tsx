import { useState } from 'react';
import { EntityDetails } from '@/types/index';
import { XMLViewerModal } from './XMLViewerModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';

interface EntityDetailsTableProps {
  entityDetails: EntityDetails;
}

/**
 * EntityDetailsTable
 * Displays entity details in a table format with sync status history
 * Features:
 * - Entity details table with source/target system and entity information
 * - Nested sync status history with revision tracking
 * - XML viewer modal for source and transformed XML
 * - Professional table styling matching current UI theme
 */
export function EntityDetailsTable({ entityDetails }: EntityDetailsTableProps) {
  const [selectedXml, setSelectedXml] = useState<{
    content: string;
    title: string;
  } | null>(null);

  const handleViewXml = (content: string, title: string) => {
    setSelectedXml({ content, title });
  };

  return (
    <div className="space-y-6">
      {/* Integration Details Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/40">
          <h3 className="text-lg font-semibold text-foreground">Integration Details</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Source and target system information
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-foreground font-semibold">Source System</TableHead>
              <TableHead className="text-foreground font-semibold">Source Entity Type</TableHead>
              <TableHead className="text-foreground font-semibold">Target System</TableHead>
              <TableHead className="text-foreground font-semibold">Target Entity Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-border hover:bg-muted/50">
              <TableCell className="font-semibold text-foreground py-4">
                {entityDetails.sourceSystem}
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {entityDetails.sourceEntityType}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-foreground py-4">
                {entityDetails.targetSystem}
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {entityDetails.targetEntityType}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Sync Status History Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Sync Status History</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Synchronization revisions and XML comparison
            </p>
          </div>
          <Badge 
            variant="default" 
            className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full px-3"
          >
            {entityDetails.syncStatusList.length} revisions
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-foreground font-semibold w-[140px]">Source Entity ID</TableHead>
                <TableHead className="text-foreground font-semibold w-[140px]">Target Entity ID</TableHead>
                <TableHead className="text-foreground font-semibold w-[120px]">Revision ID</TableHead>
                <TableHead className="text-foreground font-semibold">Start Sync Time</TableHead>
                <TableHead className="text-foreground font-semibold">Finished Sync Time</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Source Event XML</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Transformed Event XML</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entityDetails.syncStatusList.length > 0 ? (
                entityDetails.syncStatusList.map((sync, index) => (
                  <TableRow 
                    key={index}
                    className="border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-mono text-sm text-muted-foreground py-4">
                      {sync.sourceEntityId}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground py-4">
                      {sync.targetEntityId}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-mono"
                      >
                        #{sync.revisionId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground py-4">
                      {sync.startSyncTime}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground py-4">
                      {sync.finishedSyncTime}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleViewXml(
                            sync.sourceEventXML,
                            `Source Event XML - Revision ${sync.revisionId}`
                          )
                        }
                        className="gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:text-cyan-300"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleViewXml(
                            sync.transformedEventXML,
                            `Transformed Event XML - Revision ${sync.revisionId}`
                          )
                        }
                        className="gap-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border-pink-500/30 hover:text-pink-300"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    <span className="text-muted-foreground">
                      No sync history available
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* XML Viewer Modal */}
      {selectedXml && (
        <XMLViewerModal
          isOpen={Boolean(selectedXml)}
          onClose={() => setSelectedXml(null)}
          title={selectedXml.title}
          xmlContent={selectedXml.content}
        />
      )}
    </div>
  );
}
