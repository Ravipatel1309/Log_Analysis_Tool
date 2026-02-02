/**
 * Log Service - Handles all log-related API operations
 * 
 * This service layer abstracts the data fetching logic, making it easy
 * to swap mock data with real API calls to ELK/OpenSearch
 * 
 * TODO: Replace mock data imports with actual API calls
 */

import { LogEntry, LogSearchParams, ApiResponse } from '@/types';
import { getLogsForTestcase, getJenkinsServers, getLogClasses } from '@/mockData/logs';
import Fuse from 'fuse.js';

/**
 * Fetch logs for a specific testcase
 * 
 * TODO: Replace with ELK/OpenSearch API call
 * Example API: GET /api/logs?testcaseId={testcaseId}&from={from}&size={size}
 */
export const fetchLogs = async (
  testcaseId: string,
  params?: LogSearchParams
): Promise<ApiResponse<LogEntry[]>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let logs = await getLogsForTestcase(testcaseId);
  
  // Apply filters if provided
  if (params) {
    logs = filterLogs(logs, params);
  }
  
  return {
    data: logs,
    success: true,
    pagination: {
      page: 1,
      pageSize: logs.length,
      totalItems: logs.length,
      totalPages: 1,
    },
  };
};

/**
 * Filter logs based on search parameters
 */
const filterLogs = (logs: LogEntry[], params: LogSearchParams): LogEntry[] => {
  let filtered = [...logs];
  
  // Filter by log levels
  if (params.logLevels && params.logLevels.length > 0) {
    filtered = filtered.filter(log => params.logLevels!.includes(log.logLevel));
  }
  
  // Filter by timestamp range
  if (params.startTime) {
    const startDate = new Date(params.startTime).getTime();
    filtered = filtered.filter(log => new Date(log.timeStamp).getTime() >= startDate);
  }
  
  if (params.endTime) {
    const endDate = new Date(params.endTime).getTime();
    filtered = filtered.filter(log => new Date(log.timeStamp).getTime() <= endDate);
  }
  
  // Filter by log classes
  if (params.logClasses && params.logClasses.length > 0) {
    filtered = filtered.filter(log => params.logClasses!.includes(log.logClass));
  }
  
  // Filter by Jenkins servers
  if (params.jenkinsServers && params.jenkinsServers.length > 0) {
    filtered = filtered.filter(log => params.jenkinsServers!.includes(log.jenkinsServer));
  }
  
  // Apply keyword search (with optional fuzzy matching)
  if (params.keyword && params.keyword.trim()) {
    if (params.fuzzySearch) {
      // Use Fuse.js for fuzzy search
      const fuse = new Fuse(filtered, {
        keys: ['message', 'logClass'],
        threshold: 0.4, // Adjust for fuzzy tolerance
        ignoreLocation: true,
      });
      const results = fuse.search(params.keyword);
      filtered = results.map(r => r.item);
    } else {
      // Exact substring match
      const keyword = params.keyword.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(keyword) ||
        log.logClass.toLowerCase().includes(keyword)
      );
    }
  }
  
  return filtered;
};

/**
 * Get logs with context (before and after matched logs)
 * Similar to VS Code's log context view
 */
export const getLogsWithContext = (
  allLogs: LogEntry[],
  matchedLogs: LogEntry[],
  contextBefore: number,
  contextAfter: number
): { log: LogEntry; isMatched: boolean; isContext: boolean }[] => {
  const result: { log: LogEntry; isMatched: boolean; isContext: boolean }[] = [];
  const matchedIds = new Set(matchedLogs.map(l => l.id));
  const includedIds = new Set<number>();
  
  // Find indices of matched logs and include context
  matchedLogs.forEach(matchedLog => {
    const matchedIndex = allLogs.findIndex(l => l.id === matchedLog.id);
    if (matchedIndex === -1) return;
    
    // Calculate context range
    const startIdx = Math.max(0, matchedIndex - contextBefore);
    const endIdx = Math.min(allLogs.length - 1, matchedIndex + contextAfter);
    
    // Add logs in range
    for (let i = startIdx; i <= endIdx; i++) {
      const log = allLogs[i];
      if (!includedIds.has(log.id)) {
        includedIds.add(log.id);
        result.push({
          log,
          isMatched: matchedIds.has(log.id),
          isContext: !matchedIds.has(log.id),
        });
      }
    }
  });
  
  // Sort by timestamp
  result.sort((a, b) => 
    new Date(a.log.timeStamp).getTime() - new Date(b.log.timeStamp).getTime()
  );
  
  return result;
};

/**
 * Get available filter options
 * TODO: Replace with API call to get distinct values
 */
export const getFilterOptions = async (): Promise<{
  jenkinsServers: string[];
  logClasses: string[];
}> => {
  return {
    jenkinsServers: getJenkinsServers(),
    logClasses: getLogClasses(),
  };
};
