import { EntityDetails } from '@/types/index';

/**
 * Mock entity details data with sync status history
 * Used for development and testing
 */
export const mockEntityDetails: EntityDetails = {
  sourceEntityId: '5223407',
  sourceSystem: 'CA PPM',
  sourceEntityType: 'Task',
  sourceProject: 'PPM_Project_A',
  targetSystem: 'Jira',
  targetEntityType: 'Issue',
  targetProject: 'JIRA_Project_B',
  targetEntityId: 'PROJ-1234',
  entityCreationTime: '2026-01-29 23:30:17.828+05:30',
  syncStatusList: [
    {
      sourceEntityId: '5223407',
      targetEntityId: 'PROJ-1234',
      revisionId: 1,
      startSyncTime: '2026-01-30 08:15:22.451+05:30',
      finishedSyncTime: '2026-01-30 08:15:45.892+05:30',
      sourceEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<Event>
  <EventHeader>
    <EventId>EVT001</EventId>
    <Timestamp>2026-01-30T08:15:22Z</Timestamp>
    <Source>CA_PPM</Source>
    <EntityType>Task</EntityType>
  </EventHeader>
  <EventBody>
    <Entity>
      <Id>5223407</Id>
      <Name>Setup Infrastructure</Name>
      <Status>In Progress</Status>
      <Owner>john.doe@company.com</Owner>
      <StartDate>2026-01-29</StartDate>
      <DueDate>2026-02-15</DueDate>
    </Entity>
  </EventBody>
</Event>`,
      transformedEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<TransformedEvent>
  <Metadata>
    <TransformationVersion>2.0</TransformationVersion>
    <TransformationTimestamp>2026-01-30T08:15:45Z</TransformationTimestamp>
  </Metadata>
  <Data>
    <Task>
      <UniqueId>5223407</UniqueId>
      <Title>Setup Infrastructure</Title>
      <CurrentStatus>IN_PROGRESS</CurrentStatus>
      <AssignedTo>john.doe@company.com</AssignedTo>
      <ProjectDates>
        <StartDate>2026-01-29T00:00:00Z</StartDate>
        <TargetEndDate>2026-02-15T00:00:00Z</TargetEndDate>
      </ProjectDates>
      <Priority>HIGH</Priority>
    </Task>
  </Data>
</TransformedEvent>`,
    },
    {
      sourceEntityId: '5223407',
      targetEntityId: 'PROJ-1234',
      revisionId: 2,
      startSyncTime: '2026-01-30 12:45:10.123+05:30',
      finishedSyncTime: '2026-01-30 12:46:03.456+05:30',
      sourceEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<Event>
  <EventHeader>
    <EventId>EVT002</EventId>
    <Timestamp>2026-01-30T12:45:10Z</Timestamp>
    <Source>CA_PPM</Source>
    <EntityType>Task</EntityType>
  </EventHeader>
  <EventBody>
    <Entity>
      <Id>5223407</Id>
      <Name>Setup Infrastructure</Name>
      <Status>Completed</Status>
      <Owner>john.doe@company.com</Owner>
      <StartDate>2026-01-29</StartDate>
      <CompletionDate>2026-01-30</CompletionDate>
      <PercentComplete>100</PercentComplete>
    </Entity>
  </EventBody>
</Event>`,
      transformedEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<TransformedEvent>
  <Metadata>
    <TransformationVersion>2.0</TransformationVersion>
    <TransformationTimestamp>2026-01-30T12:46:03Z</TransformationTimestamp>
  </Metadata>
  <Data>
    <Task>
      <UniqueId>5223407</UniqueId>
      <Title>Setup Infrastructure</Title>
      <CurrentStatus>COMPLETED</CurrentStatus>
      <AssignedTo>john.doe@company.com</AssignedTo>
      <ProjectDates>
        <StartDate>2026-01-29T00:00:00Z</StartDate>
        <ActualEndDate>2026-01-30T00:00:00Z</ActualEndDate>
      </ProjectDates>
      <CompletionPercentage>100</CompletionPercentage>
      <Priority>HIGH</Priority>
    </Task>
  </Data>
</TransformedEvent>`,
    },
    {
      sourceEntityId: '5223407',
      targetEntityId: 'PROJ-1234',
      revisionId: 3,
      startSyncTime: '2026-01-31 14:20:45.789+05:30',
      finishedSyncTime: '2026-01-31 14:21:30.234+05:30',
      sourceEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<Event>
  <EventHeader>
    <EventId>EVT003</EventId>
    <Timestamp>2026-01-31T14:20:45Z</Timestamp>
    <Source>CA_PPM</Source>
    <EntityType>Task</EntityType>
    <Reason>Status Update</Reason>
  </EventHeader>
  <EventBody>
    <Entity>
      <Id>5223407</Id>
      <Name>Setup Infrastructure</Name>
      <Status>Completed</Status>
      <Owner>john.doe@company.com</Owner>
      <Reviewer>jane.smith@company.com</Reviewer>
      <StartDate>2026-01-29</StartDate>
      <CompletionDate>2026-01-30</CompletionDate>
      <PercentComplete>100</PercentComplete>
      <ApprovalStatus>Approved</ApprovalStatus>
    </Entity>
  </EventBody>
</Event>`,
      transformedEventXML: `<?xml version="1.0" encoding="UTF-8"?>
<TransformedEvent>
  <Metadata>
    <TransformationVersion>2.0</TransformationVersion>
    <TransformationTimestamp>2026-01-31T14:21:30Z</TransformationTimestamp>
  </Metadata>
  <Data>
    <Task>
      <UniqueId>5223407</UniqueId>
      <Title>Setup Infrastructure</Title>
      <CurrentStatus>COMPLETED</CurrentStatus>
      <AssignedTo>john.doe@company.com</AssignedTo>
      <ReviewedBy>jane.smith@company.com</ReviewedBy>
      <ProjectDates>
        <StartDate>2026-01-29T00:00:00Z</StartDate>
        <ActualEndDate>2026-01-30T00:00:00Z</ActualEndDate>
      </ProjectDates>
      <CompletionPercentage>100</CompletionPercentage>
      <ApprovalStatus>APPROVED</ApprovalStatus>
      <Priority>HIGH</Priority>
    </Task>
  </Data>
</TransformedEvent>`,
    },
  ],
};

/**
 * Utility function to get mock entity details
 * Can be extended to support multiple entities in the future
 */
export function getMockEntityDetails(): EntityDetails {
  return mockEntityDetails;
}
