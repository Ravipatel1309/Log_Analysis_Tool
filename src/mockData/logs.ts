/**
 * Mock log data for development and testing
 * 
 * TODO: Replace with actual API calls to ELK/OpenSearch
 * This data structure matches the expected schema from the log aggregation system
 */

import { LogEntry, LogLevel } from '@/types';
import { fetchLogsFromELK } from "@/services/elkLogService";

// Dynamically extract unique Jenkins servers and log classes from logs
let JENKINS_SERVERS: string[] = [];
let LOG_CLASSES: string[] = [];

/**
 * Extract unique Jenkins servers from logs
 */
const extractUniqueJenkinsServers = (logs: LogEntry[]): string[] => {
  const servers = new Set<string>();
  logs.forEach((log) => {
    if (log.jenkinsServer && log.jenkinsServer !== "UNKNOWN") {
      servers.add(log.jenkinsServer);
    }
  });
  return Array.from(servers).sort();
};

/**
 * Extract unique log classes from logs
 */
const extractUniqueLogClasses = (logs: LogEntry[]): string[] => {
  const classes = new Set<string>();
  logs.forEach((log) => {
    if (log.logClass) {
      classes.add(log.logClass);
    }
  });
  return Array.from(classes).sort();
};

/**
 * Initialize unique values from a sample testcase
 */
const initializeUniqueLists = async (): Promise<void> => {
  try {
    const sampleLogs = await fetchLogsFromELK('cee6cd52');
    JENKINS_SERVERS = extractUniqueJenkinsServers(sampleLogs);
    LOG_CLASSES = extractUniqueLogClasses(sampleLogs);
  } catch (error) {
    console.warn('Failed to initialize unique lists from sample logs:', error);
    // Fallback to sample data
    JENKINS_SERVERS = [
      'jenkins-prod-01.opshub.com',
      'jenkins-prod-02.opshub.com',
      'jenkins-staging.opshub.com',
    ];
    LOG_CLASSES = [
      'com.opshub.automation.TestRunner',
      'com.opshub.automation.APIClient',
      'com.opshub.automation.DatabaseConnector',
      'com.opshub.automation.EventProcessor',
      'com.opshub.automation.XMLParser',
      'com.opshub.automation.ValidationService',
      'com.opshub.automation.TransformationEngine',
    ];
  }
};

// Initialize on module load
initializeUniqueLists();

export const getJenkinsServers = (): string[] => JENKINS_SERVERS;

export const getLogClasses = (): string[] => LOG_CLASSES;

export const getLogsForTestcase = async (
  testcaseId: string
): Promise<LogEntry[]> => {
  const logs = await fetchLogsFromELK(testcaseId);
  
  // Update dynamic lists with logs from current testcase
  JENKINS_SERVERS = extractUniqueJenkinsServers(logs);
  LOG_CLASSES = extractUniqueLogClasses(logs);
  
  return logs;
};