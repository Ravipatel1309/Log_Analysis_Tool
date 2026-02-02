/**
 * Core type definitions for the OpsHub Log Analyzer
 * These types define the structure of log data, testcases, and related entities
 */

// Log level enum for type safety
export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG" | "TRACE";

// Testcase execution status
export type TestcaseStatus = 'PASSED' | 'FAILED' | 'RUNNING' | 'PENDING' | 'SKIPPED';


export interface LogEntry {
  id: number;
  timeStamp: string;
  logLevel: LogLevel;
  message: string;
  logClass: string;
  testcaseId: string;
  jenkinsServer: string;
  threadName?: string;
  lineNumber?: number;
}


// Testcase summary information
export interface TestcaseSummary {
  testcaseId: string;
  testcaseName: string;
  status: TestcaseStatus;
  startTime: string;
  endTime: string;
  duration: number; // in milliseconds
  totalLogs: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  jenkinsServer: string;
  buildNumber: string;
}

// Entity lifecycle data for timeline charts
export interface EntityLifecycle {
  timestamp: string;
  entityId: string;
  state: string;
  count: number;
}

// XML event data for source/transformed comparison
export interface EventXMLData {
  entityId: string;
  sourceEventXML: string;
  transformedEventXML: string;
  timestamp: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalLogs: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  debugCount: number;
  executionDuration: number;
  testcaseStatus: TestcaseStatus;
}

// Search/filter parameters for log queries
export interface LogSearchParams {
  keyword?: string;
  logLevels?: LogLevel[];
  startTime?: string;
  endTime?: string;
  logClasses?: string[];
  jenkinsServers?: string[];
  fuzzySearch?: boolean;
  contextBefore?: number;
  contextAfter?: number;
}

// Chat message for AI analysis
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Entity sync status information
export interface SyncStatus {
  sourceEntityId: string;        // Source entity ID
  targetEntityId: string;        // Target entity ID
  revisionId: number;
  startSyncTime: string;
  finishedSyncTime: string;
  sourceEventXML: string;
  transformedEventXML: string;
}

// Main entity details with sync history
export interface EntityDetails {
  sourceEntityId: string;        // Source entity ID
  sourceSystem: string;          // Source system name
  sourceEntityType: string;      // Source entity type
  sourceProject: string;         // Source project name
  targetSystem: string;          // Target system name
  targetEntityType: string;      // Target entity type
  targetProject: string;         // Target project name
  targetEntityId: string;        // Target entity ID
  entityCreationTime: string;    // Creation timestamp
  syncStatusList: SyncStatus[];
}

// API response wrapper (for future integration)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
