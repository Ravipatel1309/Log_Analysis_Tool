/**
 * Application Configuration
 * Centralized configuration for the log analyzer application
 */

export const APP_CONFIG = {
  // Application metadata
  name: 'OpsHub Log Analyzer',
  version: '1.0.0',
  
  // Default testcase ID (used when none is specified in URL)
  defaultTestcaseId: 'TC001',
  
  // Sidebar configuration
  sidebar: {
    defaultCollapsed: false,
    collapsedWidth: 64,
    expandedWidth: 256,
  },
  
  // Log display configuration
  logs: {
    defaultContextLines: 2,
    maxContextLines: 10,
    defaultPageSize: 50,
  },
  
  // Chart configuration
  charts: {
    lifecycleRefreshInterval: 30000, // 30 seconds
  },
  
  // AI Chat configuration
  aiChat: {
    maxHistoryLength: 50,
    typingIndicatorDelay: 1500,
  },
  
  // Date/time format
  dateFormat: {
    full: 'yyyy-MM-dd HH:mm:ss.SSS',
    short: 'HH:mm:ss',
    date: 'yyyy-MM-dd',
  },
} as const;

// Navigation menu items
export const NAV_ITEMS = [
  {
    path: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
  },
  {
    path: 'logs',
    label: 'Logs',
    icon: 'FileText',
  },
  {
    path: 'ai-analysis',
    label: 'Log Analysis by AI',
    icon: 'Bot',
  },
  {
    path: 'about',
    label: 'About Us',
    icon: 'Info',
  },
] as const;

// Log level configuration with colors
export const LOG_LEVEL_CONFIG = {
  ERROR: {
    label: 'ERROR',
    className: 'log-level-error',
    bgClass: 'bg-log-error',
    textClass: 'text-log-error',
  },
  WARN: {
    label: 'WARN',
    className: 'log-level-warn',
    bgClass: 'bg-log-warn',
    textClass: 'text-log-warn',
  },
  INFO: {
    label: 'INFO',
    className: 'log-level-info',
    bgClass: 'bg-log-info',
    textClass: 'text-log-info',
  },
  DEBUG: {
    label: 'DEBUG',
    className: 'log-level-debug',
    bgClass: 'bg-log-debug',
    textClass: 'text-log-debug',
  },
  TRACE: {
    label: 'TRACE',
    className: 'log-level-trace',
    bgClass: 'bg-log-trace',
    textClass: 'text-log-trace',
  },
} as const;

// Status configuration
export const STATUS_CONFIG = {
  PASSED: {
    label: 'Passed',
    className: 'status-success',
    icon: 'CheckCircle',
  },
  FAILED: {
    label: 'Failed',
    className: 'status-failed',
    icon: 'XCircle',
  },
  RUNNING: {
    label: 'Running',
    className: 'status-running',
    icon: 'Loader',
  },
  PENDING: {
    label: 'Pending',
    className: 'status-pending',
    icon: 'Clock',
  },
  SKIPPED: {
    label: 'Skipped',
    className: 'status-pending',
    icon: 'SkipForward',
  },
} as const;
