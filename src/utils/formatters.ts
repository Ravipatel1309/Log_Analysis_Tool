/**
 * Utility functions for formatting data
 */

import { format, formatDistanceToNow } from 'date-fns';
import { APP_CONFIG } from '@/config/appConfig';

/**
 * Format a timestamp for display
 */
export const formatTimestamp = (timestamp: string, formatStr?: string): string => {
  try {
    return format(new Date(timestamp), formatStr || APP_CONFIG.dateFormat.full);
  } catch {
    return timestamp;
  }
};

/**
 * Format duration in milliseconds to human readable string
 */
export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
};

/**
 * Format number with comma separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format relative time (e.g., "5 minutes ago")
 */
export const formatRelativeTime = (timestamp: string): string => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch {
    return timestamp;
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Format log class name (show only last part)
 */
export const formatLogClass = (fullClass: string): string => {
  const parts = fullClass.split('.');
  return parts[parts.length - 1] || fullClass;
};

/**
 * Format XML with proper indentation for display
 */
export const formatXML = (xml: string): string => {
  // Basic XML formatting (the mock data is already formatted)
  return xml.trim();
};

/**
 * Remove Log4j2 pattern prefix from log message
 * Pattern: YYYY-MM-DD HH:MM:SS.sssXXX LEVEL [THREAD] CLASS - [METADATA] MESSAGE
 * Extracts only the actual MESSAGE part
 */
export const cleanLogMessage = (message: string): string => {
  if (!message) return message;
  
  // Pattern explanation:
  // ^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2} – Timestamp with timezone
  // \s+[A-Z]+ – Log level (DEBUG, INFO, WARN, ERROR, TRACE)
  // \s+\[[^\]]+\] – Thread name in brackets
  // \s+[a-z0-9._]+ – Logger class name
  // \s+-(?:%notEmpty)? – Dash separator with optional %notEmpty from pattern
  // (?:\s*\[[^\]]+\])* – Optional metadata fields like [M:...], [TI:...], [DPT:...], [TEI:...], [EI:...]
  
  const cleanedMessage = message.replace(
    /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}\s+[A-Z]+\s+\[[^\]]*\]\s+[a-z0-9._]+\s+-\s*(?:\[[^\]]+\]\s*)*/i,
    ''
  );
  
  return cleanedMessage.trim();
};
