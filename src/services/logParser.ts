/**
 * Frontend Log Parsing Engine
 *
 * Pure UI-side TypeScript parser.
 * No backend calls.
 * Time-ordered, EI-correlated, state-machine based.
 */

import { LogEntry, EntityDetails, SyncStatus } from '@/types';

/* -------------------- Context Types -------------------- */

export interface EntityContext {
  sourceSystem: string;
  sourceEntity: string;
  sourceProject: string;
  targetSystem: string;
  targetEntity: string;
  targetProject: string;
}

interface ActiveSync {
  ei: string;
  sourceEntityId: string;
  revisionId: number;
  startSyncTime: string;
  finishedSyncTime?: string;

  internalId?: string;
  displayId?: string;

  sourceEventXML?: string;
  transformedEventXML?: string;

  xmlState?: XMLState;
}

enum XMLState {
  NONE,
  AWAIT_SOURCE_START,
  COLLECTING_SOURCE,
  AWAIT_TRANSFORMED_START,
  COLLECTING_TRANSFORMED,
}

/* -------------------- Dashboard Types -------------------- */

export interface WidgetMetrics {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  errorLevelLogsCount: number;
  executionTimeMs: number;
}

export interface ParsedDashboardResult {
  entityContext: EntityContext;
  entityDetails: EntityDetails;
  syncStatusList: SyncStatus[];
  widgetMetrics: WidgetMetrics;
}

/* -------------------- Parser -------------------- */

export class LogParser {
  private logs: LogEntry[];
  private entityContext: EntityContext | null = null;

  private activeSyncs = new Map<string, ActiveSync>();
  private completedSyncs: SyncStatus[] = [];

  constructor(logs: LogEntry[]) {
    this.logs = [...logs].sort(
      (a, b) =>
        new Date(a.timeStamp).getTime() -
        new Date(b.timeStamp).getTime()
    );
  }

  /* -------------------- Public API -------------------- */

  public parse(): ParsedDashboardResult | null {
    this.extractEntityContext();

    if (!this.entityContext) return null;

    for (const log of this.logs) {
      this.processLog(log);
    }

    this.finalizeIncompleteSyncs();

    this.completedSyncs.sort(
      (a, b) =>
        new Date(a.startSyncTime).getTime() -
        new Date(b.startSyncTime).getTime()
    );

    return {
      entityContext: this.entityContext,
      entityDetails: this.buildEntityDetails(),
      syncStatusList: this.completedSyncs,
      widgetMetrics: this.calculateWidgetMetrics(),
    };
  }

  /* -------------------- Step 1: Entity Context -------------------- */

  private extractEntityContext(): void {
    for (const log of this.logs) {
      if (log.message.includes('Started testcase --->>')) {
        this.entityContext = this.parseEntityContext(log.message);
        break;
      }
    }
  }

  private parseEntityContext(msg: string): EntityContext {
    const val = (k: string, d = 'UNKNOWN') =>
      msg.match(new RegExp(`${k}\\s*([^,]+)`))?.[1]?.trim() || d;

    return {
      sourceSystem: val('Source System:'),
      sourceEntity: val('Source Entity:'),
      sourceProject: val('Source Project:', 'DEFAULT'),
      targetSystem: val('Target System:'),
      targetEntity: val('Target Entity:'),
      targetProject: val('Target Project:', 'DEFAULT'),
    };
  }

  /* -------------------- Step 2–5: Log Processing -------------------- */

  private processLog(log: LogEntry): void {
  const msg = log.message;

  if (msg.includes('Start synchronizing')) {
    this.handleStartSync(log);
    return;
  }

  if (msg.includes('About to tranform New Values')) {
    return;
  }

  if (msg.includes('Source XML START')) {
    this.startSourceXML(log);
    return;
  }

  if (msg.includes('Source XML END')) {
    this.endSourceXML(log);
    return;
  }

  if (msg.includes('Transformed XML START')) {
    this.startTransformedXML(log);
    return;
  }

  if (msg.includes('Transformed XML END')) {
    this.endTransformedXML(log);
    return;
  }

  if (msg.includes('Created entity information:')) {
    this.handleEntityCreated(log);
    return;
  }

  if (msg.includes('Finished synchronizing')) {
    this.handleFinishSync(log);
    return;
  }

  // 🔥 MUST BE LAST
  this.collectXML(log);
}


  /* -------------------- Sync Lifecycle -------------------- */

  private handleStartSync(log: LogEntry): void {
    const ei = log.message.match(/\[EI:(\d+)\]/)?.[1];
    if (!ei) return;

    const sourceEntityId =
      log.message.match(/Entity Id\s*:\s*([^,]+)/)?.[1]?.trim() ||
      'UNKNOWN';

    const revisionId = Number(
      log.message.match(/Revision Id\s*:\s*(\d+)/)?.[1] || 0
    );

    this.activeSyncs.set(ei, {
      ei,
      sourceEntityId,
      revisionId,
      startSyncTime: log.timeStamp,
      xmlState: XMLState.NONE,
    });
  }

  private markAboutToTransform(log: LogEntry): void {
    const sync = this.getActiveSync(log);
    if (sync) sync.xmlState = XMLState.AWAIT_SOURCE_START;
  }

  /* -------------------- XML Handling -------------------- */

  private startSourceXML(log: LogEntry): void {
  const sync = this.getActiveSync(log);
  if (!sync) return;

  sync.xmlState = XMLState.COLLECTING_SOURCE;
  sync.sourceEventXML = '';
}

private endSourceXML(log: LogEntry): void {
  const sync = this.getActiveSync(log);
  if (!sync) return;

  sync.sourceEventXML = this.sanitizeXML(
    sync.sourceEventXML || '',
    '</SourceXML>'
  );

  sync.xmlState = XMLState.NONE;
}


private startTransformedXML(log: LogEntry): void {
  const sync = this.getActiveSync(log);
  if (!sync) return;

  sync.xmlState = XMLState.COLLECTING_TRANSFORMED;
  sync.transformedEventXML = '';
}

private endTransformedXML(log: LogEntry): void {
  const sync = this.getActiveSync(log);
  if (!sync) return;

  sync.transformedEventXML = this.sanitizeXML(
    sync.transformedEventXML || '',
    '</rootelement>'
  );

  sync.xmlState = XMLState.NONE;
}



/**
 * Clean rendered log artifacts and extract pure XML
 */
private sanitizeXML(raw: string, closingTag: string): string {
  if (!raw) return '';

  const startIdx = raw.indexOf('<?xml');
  const endIdx = raw.lastIndexOf(closingTag);

  if (startIdx === -1 || endIdx === -1) {
    return '';
  }

  const xml = raw.substring(
    startIdx,
    endIdx + closingTag.length
  );

  // Remove injected HTML / log-viewer noise
  return xml
    .replace(/class="[^"]*"/gi, '')
    .replace(/"text-log-\w+">/gi, '')
    .replace(/>\s+</g, '><')
    .trim();
}


 private collectXML(log: LogEntry): void {
  const sync = this.getActiveSync(log);
  if (!sync) return;

  // Ignore marker lines themselves
  if (
    log.message.includes('Source XML START') ||
    log.message.includes('Source XML END') ||
    log.message.includes('Transformed XML START') ||
    log.message.includes('Transformed XML END')
  ) {
    return;
  }

  if (sync.xmlState === XMLState.COLLECTING_SOURCE) {
    sync.sourceEventXML += log.message + '\n';
  }

  if (sync.xmlState === XMLState.COLLECTING_TRANSFORMED) {
    sync.transformedEventXML += log.message + '\n';
  }
}


  /* -------------------- Entity Creation -------------------- */

  private handleEntityCreated(log: LogEntry): void {
    const sync = this.getActiveSync(log);
    if (!sync) return;

    sync.internalId =
      log.message.match(/internal id:\s*([^,]+)/)?.[1]?.trim();
    sync.displayId =
      log.message.match(/display id:\s*([^,]+)/)?.[1]?.trim();
  }

  /* -------------------- Finish Sync -------------------- */

  private handleFinishSync(log: LogEntry): void {
    const sync = this.getActiveSync(log);
    if (!sync) return;

    sync.finishedSyncTime = log.timeStamp;

    this.completedSyncs.push({
      sourceEntityId: sync.sourceEntityId,
      targetEntityId: sync.displayId || 'UNKNOWN',
      revisionId: sync.revisionId,
      startSyncTime: sync.startSyncTime,
      finishedSyncTime: sync.finishedSyncTime,
      sourceEventXML: sync.sourceEventXML || '',
      transformedEventXML: sync.transformedEventXML || '',
    });

    this.activeSyncs.delete(sync.ei);
  }

  private finalizeIncompleteSyncs(): void {
    this.activeSyncs.forEach(sync => {
      this.completedSyncs.push({
        sourceEntityId: sync.sourceEntityId,
        targetEntityId: sync.displayId || 'UNKNOWN',
        revisionId: sync.revisionId,
        startSyncTime: sync.startSyncTime,
        finishedSyncTime: sync.finishedSyncTime || sync.startSyncTime,
        sourceEventXML: sync.sourceEventXML || '',
        transformedEventXML: sync.transformedEventXML || '',
      });
    });

    this.activeSyncs.clear();
  }

  /* -------------------- Helpers -------------------- */

  private getActiveSync(log: LogEntry): ActiveSync | undefined {
    const ei = log.message.match(/\[EI:(\d+)\]/)?.[1];
    return ei ? this.activeSyncs.get(ei) : undefined;
  }

  /* -------------------- Entity Details -------------------- */

  private buildEntityDetails(): EntityDetails {
    const first = this.completedSyncs[0];
    const ctx = this.entityContext!;

    return {
      sourceEntityId: first?.sourceEntityId || 'UNKNOWN',
      sourceSystem: ctx.sourceSystem,
      sourceEntityType: ctx.sourceEntity,
      sourceProject: ctx.sourceProject,
      targetSystem: ctx.targetSystem,
      targetEntityType: ctx.targetEntity,
      targetProject: ctx.targetProject,
      targetEntityId: first?.targetEntityId || 'UNKNOWN',
      entityCreationTime: first?.startSyncTime || '',
      syncStatusList: this.completedSyncs,
    };
  }

  /* -------------------- Widget Metrics -------------------- */

  private calculateWidgetMetrics(): WidgetMetrics {
    const totalSyncs = this.completedSyncs.length;
    const successfulSyncs = this.completedSyncs.filter(
      s => s.finishedSyncTime !== s.startSyncTime
    ).length;

    const failedSyncs = totalSyncs - successfulSyncs;

    const errorLevelLogsCount = this.logs.filter(l =>
      l.message.includes('ERROR')
    ).length;

    const executionTimeMs =
      this.logs.length > 1
        ? new Date(this.logs.at(-1)!.timeStamp).getTime() -
          new Date(this.logs[0].timeStamp).getTime()
        : 0;

    return {
      totalSyncs,
      successfulSyncs,
      failedSyncs,
      errorLevelLogsCount,
      executionTimeMs,
    };
  }
}

/* -------------------- Convenience API -------------------- */

export function parseLogs(logs: LogEntry[]): ParsedDashboardResult | null {
  return new LogParser(logs).parse();
}
