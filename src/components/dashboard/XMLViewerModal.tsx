/**
 * XMLViewerModal - Safe XML viewer
 * - No innerHTML
 * - No regex highlighting
 * - No XML corruption
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
import { useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface XMLViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  xmlContent: string;
}

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
        description: 'Raw XML copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy XML',
        variant: 'destructive',
      });
    }
  };

  /**
   * Safe XML pretty formatter
   * (text-only, no HTML injection)
   */
  const formattedXML = useMemo(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlContent, 'application/xml');

      if (doc.getElementsByTagName('parsererror').length) {
        return xmlContent; // invalid XML → show raw
      }

      const serializer = new XMLSerializer();
      const raw = serializer.serializeToString(doc);

      let indent = 0;
      return raw
        .replace(/(>)(<)(\/*)/g, '$1\n$2$3')
        .split('\n')
        .map((line) => {
          if (/^<\/\w/.test(line)) indent--;
          const padded = '  '.repeat(Math.max(indent, 0)) + line;
          if (/^<\w[^>]*[^\/]>$/.test(line)) indent++;
          return padded;
        })
        .join('\n');
    } catch {
      return xmlContent;
    }
  }, [xmlContent]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-4 rounded-lg border bg-muted">
          <pre className="p-4 text-sm font-mono whitespace-pre overflow-x-auto">
            {formattedXML}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
