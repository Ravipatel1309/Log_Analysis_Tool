/**
 * Logs Page - Deep log inspection and filtering
 * Features advanced search, context logs, and chronological display
 */

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, Sliders, FileText, Filter, Download, WrapText, Copy, Check } from 'lucide-react';
import { APP_CONFIG, LOG_LEVEL_CONFIG } from '@/config/appConfig';
import { LogEntry, LogSearchParams, LogLevel } from '@/types';
import { fetchLogs, getLogsWithContext, getFilterOptions } from '@/services/logService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { formatTimestamp, formatLogClass, cleanLogMessage } from '@/utils/formatters';

// Log Level Badge Component
const LogLevelBadge = ({ level, className }: { level: LogLevel; className?: string }) => {
  const config = LOG_LEVEL_CONFIG[level];
  return (
    <span className={cn('inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded min-w-[60px]', config.className, className)}>
      {config.label}
    </span>
  );
};

// Log Entry Component
const LogEntryDisplay = ({ log, isMatched = false, isContext = false, softWrap = true }: { log: LogEntry; isMatched?: boolean; isContext?: boolean; softWrap?: boolean }) => {
  const truncatedClass = formatLogClass(log.logClass);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cleanLogMessage(log.message));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [log.message]);

  return (
    <div className={cn(
      'py-2 px-4 border-b border-border/40 hover:bg-muted/50 transition-colors text-sm group',
      isMatched && 'matched-log bg-primary/8 border-primary/30',
      isContext && 'opacity-75 bg-muted/20'
    )}>
      <div className={cn('flex items-start gap-2 pb-1', softWrap ? '' : 'overflow-x-auto')}>
        <span className="text-muted-foreground whitespace-nowrap text-xs font-medium">{formatTimestamp(log.timeStamp, 'HH:mm:ss.SSS')}</span>
        <LogLevelBadge level={log.logLevel} className="shrink-0" />
        <span className="text-muted-foreground text-xs font-medium w-40 shrink-0 truncate" title={log.logClass}>[{truncatedClass}]</span>
        <span className={cn('flex-1 text-foreground leading-relaxed', softWrap ? 'break-words whitespace-pre-wrap' : 'whitespace-nowrap')}>{cleanLogMessage(log.message)}</span>
        <button 
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 hover:bg-muted rounded ml-2"
          title="Copy message"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

// Advanced Search Bar Component
const LOG_LEVELS: LogLevel[] = ['ERROR', 'DEBUG'];

interface SearchBarProps {
  onSearch: (params: LogSearchParams) => void;
  jenkinsServers: string[];
  logClasses: string[];
  contextLines: number;
  onContextChange: (value: number) => void;
  softWrap: boolean;
  onSoftWrapChange: (value: boolean) => void;
  onExport: () => void;
}

const SearchBar = ({ onSearch, jenkinsServers, logClasses, contextLines, onContextChange, softWrap, onSoftWrapChange, onExport }: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<LogLevel[]>([]);
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [fuzzySearch, setFuzzySearch] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch({
      keyword,
      logLevels: selectedLevels.length > 0 ? selectedLevels : undefined,
      jenkinsServers: selectedServers.length > 0 ? selectedServers : undefined,
      logClasses: selectedClasses.length > 0 ? selectedClasses : undefined,
      fuzzySearch,
    });
  }, [keyword, selectedLevels, selectedServers, selectedClasses, fuzzySearch, onSearch]);

  const handleClear = useCallback(() => {
    setKeyword('');
    setSelectedLevels([]);
    setSelectedServers([]);
    setSelectedClasses([]);
    setFuzzySearch(false);
    onSearch({});
  }, [onSearch]);

  // Live search: trigger search on filter changes with debounce for keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, selectedLevels, selectedServers, selectedClasses, fuzzySearch, handleSearch]);

  const toggleLevel = (level: LogLevel) => {
    setSelectedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };

  const activeFiltersCount = selectedLevels.length + selectedServers.length + selectedClasses.length + (fuzzySearch ? 1 : 0);

  return (
    <div className="bg-gradient-to-br from-card to-muted/30 border border-border/60 rounded-lg p-4 space-y-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
          <Input 
            placeholder="Search logs..." 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
            className="pl-10 bg-background/80 border-border/60" 
          />
        </div>
        <div className="flex gap-2 flex-wrap lg:flex-nowrap items-center">
          <div className="flex gap-1">
            {LOG_LEVELS.map((level) => (
              <Badge 
                key={level} 
                variant={selectedLevels.includes(level) ? 'default' : 'outline'} 
                className={`cursor-pointer transition-all px-3 py-1.5 font-semibold border-primary/40 ${selectedLevels.includes(level) ? LOG_LEVEL_CONFIG[level].className + ' shadow-sm scale-105 border-primary/80' : 'hover:bg-muted/80 hover:scale-105 hover:border-primary/60'}`} 
                onClick={() => toggleLevel(level)}
              >
                {level}
              </Badge>
            ))}
          </div>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn('gap-2 transition-all border-primary/40', activeFiltersCount > 0 ? 'bg-primary/10 border-primary/80 text-primary hover:bg-primary/20 shadow-sm' : 'hover:border-primary/60 hover:bg-primary/5')}
              >
                <Sliders className="h-4 w-4" />
                Advanced Filters
                {activeFiltersCount > 0 && <Badge variant="secondary" className="ml-1 scale-90">{activeFiltersCount}</Badge>}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          <Button 
            onClick={() => onSoftWrapChange(!softWrap)} 
            variant={softWrap ? 'default' : 'outline'}
            size="sm"
            className={cn('gap-2 transition-all border-primary/40', softWrap ? 'shadow-sm bg-primary hover:bg-primary/90' : 'hover:border-primary/60 hover:bg-primary/5')}
          >
            <WrapText className="h-4 w-4" />
            Soft Wrap
          </Button>
          <Button 
            onClick={onExport} 
            variant="outline" 
            size="sm"
            className="gap-2 transition-all border-primary/40 hover:border-primary/60 hover:bg-primary/5"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          {activeFiltersCount > 0 && <Button variant="outline" onClick={handleClear} size="sm" className="gap-2 border-primary/40 hover:border-red-500/60 hover:bg-red-500/5"><X className="h-4 w-4" />Clear</Button>}
        </div>
      </div>

      {isExpanded && (
        <div className="pt-2 space-y-4 border-t border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Jenkins Server</Label>
              <Select value={selectedServers[0] || ''} onValueChange={(value) => setSelectedServers(value && value !== 'all' ? [value] : [])}>
                <SelectTrigger className="bg-background/80 border-border/60"><SelectValue placeholder="All servers" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All servers</SelectItem>{jenkinsServers.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Log Class</Label>
              <Select value={selectedClasses[0] || ''} onValueChange={(value) => setSelectedClasses(value && value !== 'all' ? [value] : [])}>
                <SelectTrigger className="bg-background/80 border-border/60"><SelectValue placeholder="All classes" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All classes</SelectItem>{logClasses.map((c) => <SelectItem key={c} value={c}>{c.split('.').pop()}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border/40">
            <div className="flex items-center gap-2"><Switch id="fuzzy" checked={fuzzySearch} onCheckedChange={setFuzzySearch} /><Label htmlFor="fuzzy" className="cursor-pointer">Fuzzy Search</Label></div>
            <div className="flex items-center gap-2"><Label className="shrink-0">Context Lines:</Label><Input type="number" min={0} max={10} value={contextLines} onChange={(e) => onContextChange(parseInt(e.target.value) || 0)} className="w-16 bg-background/80 border-border/60" /></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Logs Page Component
const Logs = () => {
  const { testcaseId } = useParams<{ testcaseId: string }>();
  const navigate = useNavigate();
  const currentTestcaseId = testcaseId || APP_CONFIG.defaultTestcaseId;

  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [displayLogs, setDisplayLogs] = useState<{ log: LogEntry; isMatched: boolean; isContext: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jenkinsServers, setJenkinsServers] = useState<string[]>([]);
  const [logClasses, setLogClasses] = useState<string[]>([]);
  const [contextLines, setContextLines] = useState<number>(APP_CONFIG.logs.defaultContextLines);
  const [searchParams, setSearchParams] = useState<LogSearchParams>({});
  const [softWrap, setSoftWrap] = useState(true);

  useEffect(() => {
    if (!testcaseId) {
      navigate(`/logs/${APP_CONFIG.defaultTestcaseId}`, { replace: true });
    }
  }, [testcaseId, navigate]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch logs first to populate the dynamic filter options
        const logsRes = await fetchLogs(currentTestcaseId);
        setAllLogs(logsRes.data);
        setFilteredLogs(logsRes.data);
        setDisplayLogs(logsRes.data.map(log => ({ log, isMatched: true, isContext: false })));
        
        // Then get filter options (which will be populated from the logs)
        const filtersRes = await getFilterOptions();
        setJenkinsServers(filtersRes.jenkinsServers);
        setLogClasses(filtersRes.logClasses);
      } catch (error) {
        console.error('Failed to load logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentTestcaseId]);

  const handleSearch = useCallback(async (params: LogSearchParams) => {
    setSearchParams(params);
    setIsLoading(true);
    try {
      const result = await fetchLogs(currentTestcaseId, params);
      const matchedLogs = result.data;
      setFilteredLogs(matchedLogs);
      if (contextLines > 0 && params.keyword) {
        setDisplayLogs(getLogsWithContext(allLogs, matchedLogs, contextLines, contextLines));
      } else {
        setDisplayLogs(matchedLogs.map(log => ({ log, isMatched: true, isContext: false })));
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTestcaseId, allLogs, contextLines]);

  useEffect(() => {
    if (searchParams.keyword && filteredLogs.length > 0) {
      if (contextLines > 0) {
        setDisplayLogs(getLogsWithContext(allLogs, filteredLogs, contextLines, contextLines));
      } else {
        setDisplayLogs(filteredLogs.map(log => ({ log, isMatched: true, isContext: false })));
      }
    }
  }, [contextLines, filteredLogs, allLogs, searchParams.keyword]);

  const handleExportLogs = useCallback(() => {
    // Create log content with original messages (not cleaned)
    const logContent = displayLogs
      .map(({ log }) => {
        const timestamp = formatTimestamp(log.timeStamp, 'yyyy-MM-dd HH:mm:ss.SSS');
        const level = log.logLevel;
        const logClass = log.logClass;
        const message = log.message; // Use original message with pattern
        return `${timestamp} ${level} [${logClass}] ${message}`;
      })
      .join('\n');

    // Create blob and download
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${currentTestcaseId}-${new Date().toISOString().split('T')[0]}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [displayLogs, currentTestcaseId]);

  return (
    <div className="h-full w-full flex flex-col bg-background p-4 md:p-6 space-y-4">
      <div className="border-b border-border/40 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Log Viewer</h1>
            <p className="text-muted-foreground text-sm mt-1">Testcase: <span className="font-mono font-semibold text-primary">{currentTestcaseId}</span></p>
          </div>
        </div>
      </div>

      <SearchBar 
        onSearch={handleSearch} 
        jenkinsServers={jenkinsServers} 
        logClasses={logClasses} 
        contextLines={contextLines} 
        onContextChange={setContextLines}
        softWrap={softWrap}
        onSoftWrapChange={setSoftWrap}
        onExport={handleExportLogs}
      />

      <div className="flex items-center gap-4 text-sm border-b border-border/40 bg-muted/30 px-4 py-3 rounded-t-lg flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">Showing <span className="text-primary font-bold">{displayLogs.length}</span> of <span className="text-muted-foreground">{allLogs.length}</span> logs</span>
        </div>
        {searchParams.keyword && <Badge variant="secondary" className="gap-1 ml-auto"><Filter className="h-3 w-3" />{filteredLogs.length} matches</Badge>}
        {contextLines > 0 && searchParams.keyword && <Badge variant="outline">±{contextLines} context</Badge>}
      </div>

      <div className="bg-card border border-t-0 rounded-b-lg overflow-hidden shadow-md flex flex-col flex-1 min-h-0">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2 flex-1 justify-center">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span>Loading logs...</span>
          </div>
        ) : displayLogs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex-1 flex items-center justify-center">No logs found matching your criteria</div>
        ) : (
          <div className="overflow-y-auto flex-1 min-h-0">
            <div className="font-mono">
              {displayLogs.map(({ log, isMatched, isContext }, idx) => (
                <LogEntryDisplay key={`${log.id}-${idx}`} log={log} isMatched={isMatched} isContext={isContext} softWrap={softWrap} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary/20 border border-primary" /><span>Matched log</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-muted/40 border border-muted" /><span>Context log</span></div>
        </div>
        <span className="hidden sm:inline">
          {softWrap ? 'Soft wrap enabled' : 'Soft wrap disabled - use horizontal scroll'} • Live search active
        </span>
      </div>
    </div>
  );
};

export default Logs;
