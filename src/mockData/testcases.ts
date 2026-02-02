/**
 * Mock testcase data for development and testing
 * 
 * TODO: Replace with actual API calls to test management system
 */

import { TestcaseSummary, DashboardStats, EntityLifecycle, EventXMLData } from '@/types';
import { getLogsForTestcase } from './logs';

/**
 * Generate dashboard statistics from log data
 * TODO: Replace with aggregation query to ELK/OpenSearch
 */
export const getDashboardStats = async (testcaseId: string): Promise<DashboardStats> => {
  const logs = await getLogsForTestcase(testcaseId);
  
  const errorCount = logs.filter(l => l.logLevel === 'ERROR').length;
  const warnCount = logs.filter(l => l.logLevel === 'WARN').length;
  const infoCount = logs.filter(l => l.logLevel === 'INFO').length;
  const debugCount = logs.filter(l => l.logLevel === 'DEBUG').length;

  // Determine status based on error count
  let status: DashboardStats['testcaseStatus'] = 'PASSED';
  if (errorCount > 5) status = 'FAILED';
  else if (errorCount > 0) status = 'PASSED'; // Passed with warnings

  const firstLog = logs[0];
  const lastLog = logs[logs.length - 1];
  const duration = firstLog && lastLog 
    ? new Date(lastLog.timeStamp).getTime() - new Date(firstLog.timeStamp).getTime()
    : 0;

  return {
    totalLogs: logs.length,
    errorCount,
    warnCount,
    infoCount,
    debugCount,
    executionDuration: duration,
    testcaseStatus: status,
  };
};

/**
 * Get testcase summary information
 * TODO: Replace with API call
 */
export const getTestcaseSummary = async (testcaseId: string): Promise<TestcaseSummary> => {
  const stats = await getDashboardStats(testcaseId);
  const logs = await getLogsForTestcase(testcaseId);
  
  return {
    testcaseId,
    testcaseName: `Integration Test - ${testcaseId}`,
    status: stats.testcaseStatus,
    startTime: logs[0]?.timeStamp || new Date().toISOString(),
    endTime: logs[logs.length - 1]?.timeStamp || new Date().toISOString(),
    duration: stats.executionDuration,
    totalLogs: stats.totalLogs,
    errorCount: stats.errorCount,
    warnCount: stats.warnCount,
    infoCount: stats.infoCount,
    jenkinsServer: logs[0]?.jenkinsServer || 'jenkins-prod-01.opshub.com',
    buildNumber: `#${Math.floor(Math.random() * 1000) + 500}`,
  };
};

/**
 * Generate entity lifecycle data for timeline charts
 * TODO: Replace with time-series query to ELK/OpenSearch
 */
export const getEntityLifecycleData = (testcaseId: string): EntityLifecycle[] => {
  const baseTime = new Date('2025-01-30T10:00:00Z');
  const states = ['CREATED', 'PROCESSING', 'VALIDATED', 'TRANSFORMED', 'COMPLETED'];
  const data: EntityLifecycle[] = [];

  // Generate 20 data points over 1 hour
  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(baseTime.getTime() + i * 3 * 60 * 1000); // 3 min intervals
    data.push({
      timestamp: timestamp.toISOString(),
      entityId: `ENT_${testcaseId}_${i}`,
      state: states[Math.min(Math.floor(i / 4), states.length - 1)],
      count: Math.floor(Math.random() * 50) + 10 + i * 5,
    });
  }

  return data;
};

/**
 * Sample XML data for source/transformed comparison
 * TODO: Replace with actual event data from API
 */
export const getEventXMLData = (testcaseId: string): EventXMLData[] => {
  return [
    {
      entityId: 'ENT001',
      timestamp: '2025-01-30T10:05:00Z',
      sourceEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<Event xmlns="http://opshub.com/events/v1">
  <Header>
    <EventId>EVT-2025-001234</EventId>
    <EventType>WorkItemCreated</EventType>
    <Timestamp>2025-01-30T10:05:00.000Z</Timestamp>
    <Source>
      <System>JIRA</System>
      <Instance>jira-prod-01</Instance>
      <Project>OPSHUB</Project>
    </Source>
  </Header>
  <Payload>
    <WorkItem>
      <Id>OPSHUB-1234</Id>
      <Title>Implement new feature for log analysis</Title>
      <Description>
        As a developer, I want to analyze logs effectively
        so that I can debug issues faster.
      </Description>
      <Status>Open</Status>
      <Priority>High</Priority>
      <Assignee>john.doe@opshub.com</Assignee>
      <CreatedBy>jane.smith@opshub.com</CreatedBy>
      <CreatedDate>2025-01-30T10:05:00.000Z</CreatedDate>
    </WorkItem>
  </Payload>
</Event>`,
      transformedEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<TransformedEvent xmlns="http://opshub.com/transformed/v2">
  <Metadata>
    <OriginalEventId>EVT-2025-001234</OriginalEventId>
    <TransformationId>TRF-001234</TransformationId>
    <TransformationTimestamp>2025-01-30T10:05:01.234Z</TransformationTimestamp>
    <TargetSystem>ServiceNow</TargetSystem>
  </Metadata>
  <MappedFields>
    <Incident>
      <Number>INC0012345</Number>
      <ShortDescription>Implement new feature for log analysis</ShortDescription>
      <Description>
        As a developer, I want to analyze logs effectively
        so that I can debug issues faster.
        
        Source: JIRA (OPSHUB-1234)
      </Description>
      <State>New</State>
      <Impact>2</Impact>
      <Urgency>2</Urgency>
      <AssignedTo>john.doe</AssignedTo>
      <OpenedBy>jane.smith</OpenedBy>
      <OpenedAt>2025-01-30T10:05:00.000Z</OpenedAt>
    </Incident>
  </MappedFields>
  <AuditTrail>
    <Step sequence="1">Field Mapping Applied</Step>
    <Step sequence="2">User Resolution Completed</Step>
    <Step sequence="3">Validation Passed</Step>
  </AuditTrail>
</TransformedEvent>`,
    },
    {
      entityId: 'ENT002',
      timestamp: '2025-01-30T10:10:00Z',
      sourceEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<Event xmlns="http://opshub.com/events/v1">
  <Header>
    <EventId>EVT-2025-001235</EventId>
    <EventType>WorkItemUpdated</EventType>
    <Timestamp>2025-01-30T10:10:00.000Z</Timestamp>
    <Source>
      <System>JIRA</System>
      <Instance>jira-prod-01</Instance>
      <Project>OPSHUB</Project>
    </Source>
  </Header>
  <Payload>
    <WorkItem>
      <Id>OPSHUB-1235</Id>
      <Title>Bug fix for database connection</Title>
      <Status>In Progress</Status>
      <Priority>Critical</Priority>
      <Assignee>dev.team@opshub.com</Assignee>
    </WorkItem>
  </Payload>
</Event>`,
      transformedEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<TransformedEvent xmlns="http://opshub.com/transformed/v2">
  <Metadata>
    <OriginalEventId>EVT-2025-001235</OriginalEventId>
    <TransformationId>TRF-001235</TransformationId>
    <TransformationTimestamp>2025-01-30T10:10:00.500Z</TransformationTimestamp>
    <TargetSystem>ServiceNow</TargetSystem>
  </Metadata>
  <MappedFields>
    <Incident>
      <Number>INC0012346</Number>
      <ShortDescription>Bug fix for database connection</ShortDescription>
      <State>In Progress</State>
      <Impact>1</Impact>
      <Urgency>1</Urgency>
      <AssignedTo>dev.team</AssignedTo>
    </Incident>
  </MappedFields>
</TransformedEvent>`,
    },
    {
      entityId: 'ENT003',
      timestamp: '2025-01-30T10:15:00Z',
      sourceEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<Event xmlns="http://opshub.com/events/v1">
  <Header>
    <EventId>EVT-2025-001236</EventId>
    <EventType>CommentAdded</EventType>
    <Timestamp>2025-01-30T10:15:00.000Z</Timestamp>
    <Source>
      <System>JIRA</System>
      <Instance>jira-prod-01</Instance>
    </Source>
  </Header>
  <Payload>
    <Comment>
      <ParentId>OPSHUB-1234</ParentId>
      <Author>qa.engineer@opshub.com</Author>
      <Body>Testing completed successfully. All edge cases covered.</Body>
    </Comment>
  </Payload>
</Event>`,
      transformedEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<TransformedEvent xmlns="http://opshub.com/transformed/v2">
  <Metadata>
    <OriginalEventId>EVT-2025-001236</OriginalEventId>
    <TransformationId>TRF-001236</TransformationId>
    <TransformationTimestamp>2025-01-30T10:15:00.750Z</TransformationTimestamp>
    <TargetSystem>ServiceNow</TargetSystem>
  </Metadata>
  <MappedFields>
    <JournalEntry>
      <IncidentNumber>INC0012345</IncidentNumber>
      <Type>work_notes</Type>
      <Value>Testing completed successfully. All edge cases covered. (From: JIRA Comment by qa.engineer)</Value>
    </JournalEntry>
  </MappedFields>
</TransformedEvent>`,
    },
  ];
};
