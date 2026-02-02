/**
 * Frontend Log Parsing Engine
 * 
 * Pure TypeScript state-machine parser that processes raw logs into structured domain data.
 * Single-pass parsing with correlation by EI (Entity Identifier).
 * 
 * No backend calls - all processing is frontend-only.
 */

import { LogEntry, EntityDetails, SyncStatus } from '@/types';

/**
 * Entity context extracted from global log patterns
 */
export interface EntityContext {
  sourceSystem: string;
  sourceEntity: string;
  sourceProject: string;
  targetSystem: string;
  targetEntity: string;
  targetProject: string;
}

/**
 * Intermediate sync tracking during parsing
 */
interface ActiveSync {
  entityId: string;
  revisionId: number;
  ei: string;
  startSyncTime: string;
  finishedSyncTime?: string;
  internalId?: string;
  displayId?: string;
  sourceEventXML?: string;
  transformedEventXML?: string;
}

/**
 * Final parsed result
 */
export interface ParsedDashboardResult {
  entityContext: EntityContext;
  entityDetails: EntityDetails;
  syncStatusList: SyncStatus[];
}

/**
 * Main parser class using state machine pattern
 */
export class LogParser {
  private logs: LogEntry[];
  private currentIndex: number = 0;
  private entityContext: EntityContext | null = null;
  private activeSyncs: Map<string, ActiveSync> = new Map();
  private completedSyncs: SyncStatus[] = [];

  constructor(logs: LogEntry[]) {
    // Sort logs by timestamp to ensure chronological order
    this.logs = [...logs].sort((a, b) => 
      new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );
  }

  /**
   * Main parsing method - single pass through logs
   */
  public parse(): ParsedDashboardResult | null {
    // Step 1: Extract global entity context
    this.extractEntityContext();
    
    if (!this.entityContext) {
      console.warn('No entity context found in logs');
      return null;
    }

    // Step 2-5: Process all logs in chronological order
    for (this.currentIndex = 0; this.currentIndex < this.logs.length; this.currentIndex++) {
      const log = this.logs[this.currentIndex];
      this.processLogEntry(log);
    }

    // Finalize any remaining active syncs
    this.finalizeActiveSyncs();

    // Sort completed syncs by start time
    this.completedSyncs.sort((a, b) => 
      new Date(a.startSyncTime).getTime() - new Date(b.startSyncTime).getTime()
    );

    // Build entity details
    const entityDetails = this.buildEntityDetails();

    return {
      entityContext: this.entityContext,
      entityDetails,
      syncStatusList: this.completedSyncs,
    };
  }

  /**
   * Step 1: Extract global entity context
   * Pattern: "Started testcase --->>"
   */
  private extractEntityContext(): void {
    for (const log of this.logs) {
      if (log.message.includes('Started testcase --->>')) {
        this.entityContext = this.parseEntityContext(log.message);
        if (this.entityContext) break;
      }
    }
  }

  /**
   * Parse entity context from log message
   */
  private parseEntityContext(message: string): EntityContext | null {
    // Enhanced regex to capture entity context details
    // Looking for patterns like: Source: System, Entity; Target: System, Entity
    
    const sourceMatch = message.match(/Source[:\s]+([^,]+)[,\s]+([^\s;]+)/i);
    const targetMatch = message.match(/Target[:\s]+([^,]+)[,\s]+([^\s;]+)/i);
    const projectMatch = message.match(/Project[:\s]+([^,]+)[,\s]+([^\s;]+)/i);

    if (sourceMatch && targetMatch) {
      return {
        sourceSystem: sourceMatch[1]?.trim() || 'UNKNOWN',
        sourceEntity: sourceMatch[2]?.trim() || 'UNKNOWN',
        sourceProject: projectMatch?.[1]?.trim() || 'DEFAULT',
        targetSystem: targetMatch[1]?.trim() || 'UNKNOWN',
        targetEntity: targetMatch[2]?.trim() || 'UNKNOWN',
        targetProject: projectMatch?.[2]?.trim() || 'DEFAULT',
      };
    }

    // Fallback: Extract from message text
    return {
      sourceSystem: this.extractValue(message, 'Source System', 'UNKNOWN'),
      sourceEntity: this.extractValue(message, 'Source Entity', 'UNKNOWN'),
      sourceProject: this.extractValue(message, 'Source Project', 'DEFAULT'),
      targetSystem: this.extractValue(message, 'Target System', 'UNKNOWN'),
      targetEntity: this.extractValue(message, 'Target Entity', 'UNKNOWN'),
      targetProject: this.extractValue(message, 'Target Project', 'DEFAULT'),
    };
  }

  /**
   * Extract a value from message text
   */
  private extractValue(message: string, key: string, defaultValue: string): string {
    const regex = new RegExp(`${key}[:\\s]+([^,;]+)`, 'i');
    const match = message.match(regex);
    return match?.[1]?.trim() || defaultValue;
  }

  /**
   * Process a single log entry
   */
  private processLogEntry(log: LogEntry): void {
    const message = log.message;

    // Step 2: Detect Start Synchronizing
    if (message.includes('Start synchronizing of Entity Id') || 
        message.includes('Starting sync for')) {
      this.handleStartSync(log);
    }

    // Step 3: Capture XML transformation data
    if (message.includes('About to tranform New Values') ||
        message.includes('About to transform')) {
      this.captureXMLData(log);
    }

    // Step 4: Extract created entity information
    if (message.includes('Created entity information:')) {
      this.handleEntityCreated(log);
    }

    // Step 5: Detect Finished Synchronizing
    if (message.includes('Finished synchronizing of Entity Id') ||
        message.includes('Sync completed for')) {
      this.handleFinishSync(log);
    }
  }

  /**
   * Step 2: Handle Start Synchronizing
   * Pattern: "Start synchronizing of Entity Id {entityId} with revision {revisionId}"
   */
  private handleStartSync(log: LogEntry): void {
    const entityMatch = log.message.match(/Entity\s+Id[:\s]+([^\s,]+)/i);
    const revisionMatch = log.message.match(/revision[:\s]+(\d+)/i);
    const eiMatch = log.message.match(/EI[:\s]+([^\s,;]+)/i);

    if (entityMatch) {
      const entityId = entityMatch[1];
      const revisionId = revisionMatch ? parseInt(revisionMatch[1], 10) : 1;
      const ei = eiMatch ? eiMatch[1] : `${entityId}-${revisionId}`;

      const syncKey = `${ei}`;
      
      const activeSync: ActiveSync = {
        entityId,
        revisionId,
        ei,
        startSyncTime: log.timeStamp,
      };

      this.activeSyncs.set(syncKey, activeSync);
    }
  }

  /**
   * Step 3: Capture XML data
   * Captures multi-line XML blocks between markers
   */
  private captureXMLData(log: LogEntry): void {
    const eiMatch = log.message.match(/EI[:\s]+([^\s,;]+)/i);
    if (!eiMatch) return;

    const ei = eiMatch[1];
    const activeSync = this.activeSyncs.get(ei);
    if (!activeSync) return;

    // Capture source XML
    const sourceXML = this.extractXMLBlock('Source XML START', 'Source XML END');
    if (sourceXML) {
      activeSync.sourceEventXML = sourceXML;
    }

    // Capture transformed XML
    const transformedXML = this.extractXMLBlock('Transformed XML START', 'Transformed XML END');
    if (transformedXML) {
      activeSync.transformedEventXML = transformedXML;
    }
  }

  /**
   * Extract XML block from logs
   */
  private extractXMLBlock(startMarker: string, endMarker: string): string | null {
    const startIdx = this.currentIndex;
    let foundStart = false;
    let xmlLines: string[] = [];

    for (let i = startIdx; i < Math.min(startIdx + 100, this.logs.length); i++) {
      const msg = this.logs[i].message;

      if (msg.includes(startMarker)) {
        foundStart = true;
        // Extract content after the marker
        const afterMarker = msg.split(startMarker)[1]?.trim();
        if (afterMarker && !afterMarker.includes(endMarker)) {
          xmlLines.push(afterMarker);
        }
        continue;
      }

      if (foundStart) {
        if (msg.includes(endMarker)) {
          const beforeMarker = msg.split(endMarker)[0]?.trim();
          if (beforeMarker) {
            xmlLines.push(beforeMarker);
          }
          break;
        }
        xmlLines.push(msg);
      }
    }

    return xmlLines.length > 0 ? xmlLines.join('\n').trim() : null;
  }

  /**
   * Step 4: Handle Entity Created
   * Pattern: "Created entity information: internalId={id}, displayId={id}"
   */
  private handleEntityCreated(log: LogEntry): void {
    const eiMatch = log.message.match(/EI[:\s]+([^\s,;]+)/i);
    if (!eiMatch) return;

    const ei = eiMatch[1];
    const activeSync = this.activeSyncs.get(ei);
    if (!activeSync) return;

    const internalMatch = log.message.match(/internalId[=:\s]+([^\s,;]+)/i);
    const displayMatch = log.message.match(/displayId[=:\s]+([^\s,;]+)/i);

    if (internalMatch) {
      activeSync.internalId = internalMatch[1];
    }
    if (displayMatch) {
      activeSync.displayId = displayMatch[1];
    }
  }

  /**
   * Step 5: Handle Finish Synchronizing
   * Pattern: "Finished synchronizing of Entity Id {entityId} with revision {revisionId}"
   */
  private handleFinishSync(log: LogEntry): void {
    const entityMatch = log.message.match(/Entity\s+Id[:\s]+([^\s,]+)/i);
    const revisionMatch = log.message.match(/revision[:\s]+(\d+)/i);
    const eiMatch = log.message.match(/EI[:\s]+([^\s,;]+)/i);

    if (entityMatch) {
      const entityId = entityMatch[1];
      const revisionId = revisionMatch ? parseInt(revisionMatch[1], 10) : 1;
      const ei = eiMatch ? eiMatch[1] : `${entityId}-${revisionId}`;

      const activeSync = this.activeSyncs.get(ei);
      if (activeSync) {
        activeSync.finishedSyncTime = log.timeStamp;

        // Convert to completed sync
        const completedSync: SyncStatus = {
          sourceEntityId: activeSync.entityId,
          targetEntityId: activeSync.displayId || activeSync.entityId,
          revisionId: activeSync.revisionId,
          startSyncTime: activeSync.startSyncTime,
          finishedSyncTime: activeSync.finishedSyncTime,
          sourceEventXML: activeSync.sourceEventXML || '',
          transformedEventXML: activeSync.transformedEventXML || '',
        };

        this.completedSyncs.push(completedSync);
        this.activeSyncs.delete(ei);
      }
    }
  }

  /**
   * Finalize any remaining active syncs (incomplete)
   */
  private finalizeActiveSyncs(): void {
    this.activeSyncs.forEach((activeSync) => {
      const completedSync: SyncStatus = {
        sourceEntityId: activeSync.entityId,
        targetEntityId: activeSync.displayId || activeSync.entityId,
        revisionId: activeSync.revisionId,
        startSyncTime: activeSync.startSyncTime,
        finishedSyncTime: activeSync.finishedSyncTime || activeSync.startSyncTime,
        sourceEventXML: activeSync.sourceEventXML || '',
        transformedEventXML: activeSync.transformedEventXML || '',
      };

      this.completedSyncs.push(completedSync);
    });

    this.activeSyncs.clear();
  }

  /**
   * Build final EntityDetails from parsed data
   */
  private buildEntityDetails(): EntityDetails {
    const ctx = this.entityContext!;
    const earliestSync = this.completedSyncs.length > 0 
      ? this.completedSyncs[0] 
      : null;

    return {
      sourceEntityId: earliestSync?.sourceEntityId || 'UNKNOWN',
      sourceSystem: ctx.sourceSystem,
      sourceEntityType: ctx.sourceEntity,
      targetSystem: ctx.targetSystem,
      targetEntityType: ctx.targetEntity,
      targetEntityId: earliestSync?.targetEntityId || 'UNKNOWN',
      entityCreationTime: earliestSync?.startSyncTime || new Date().toISOString(),
      syncStatusList: this.completedSyncs,
    };
  }
}

/**
 * Convenience function for parsing logs
 */
export function parseLogs(logs: LogEntry[]): ParsedDashboardResult | null {
  const parser = new LogParser(logs);
  return parser.parse();
}

/**
 * Extract statistics from parsed result
 */
export function extractDashboardStats(result: ParsedDashboardResult) {
  const syncCount = result.syncStatusList.length;
  const errorCount = result.syncStatusList.filter(s => 
    s.transformedEventXML.includes('error') || 
    s.transformedEventXML.includes('failed')
  ).length;

  return {
    totalSyncs: syncCount,
    successfulSyncs: syncCount - errorCount,
    failedSyncs: errorCount,
    earliestSync: result.syncStatusList[0]?.startSyncTime,
    latestSync: result.syncStatusList[result.syncStatusList.length - 1]?.finishedSyncTime,
  };
}
