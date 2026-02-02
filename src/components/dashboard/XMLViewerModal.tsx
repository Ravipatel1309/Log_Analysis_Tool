/**
 * XMLViewerModal - Modal dialog for viewing XML content
 * Displays formatted XML with syntax highlighting
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface XMLViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  xmlContent: string;
}

/**
 * Modal for displaying XML content with copy functionality
 */
export const XMLViewerModal = ({
  isOpen,
  onClose,
  title,
  xmlContent,
}: XMLViewerModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xmlContent);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'XML content copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  // Simple XML syntax highlighting
  const highlightXML = (xml: string) => {
    return xml
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(&lt;\/?[\w:-]+)/g, '<span class="text-log-info">$1</span>')
      .replace(/(&gt;)/g, '<span class="text-log-info">$1</span>')
      .replace(/([\w:-]+)=/g, '<span class="text-log-warn">$1</span>=')
      .replace(/"([^"]*)"/g, '<span class="text-status-success">"$1"</span>');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 mt-4 rounded-lg bg-muted/50 border">
          <pre
            className="p-4 xml-viewer text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightXML(xmlContent) }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
