/**
 * Example Test Logs for Frontend Log Parser
 * 
 * These logs demonstrate the expected format and patterns for the parser.
 * Use these to test the parser with realistic data.
 */

import { LogEntry } from '@/types';

/**
 * Complete sync cycle: START → TRANSFORM → XML → FINISHED
 * This represents a successful entity synchronization
 */
export const getCompleteTestLogs = (): LogEntry[] => [
  {
    id: 1,
    timeStamp: '2024-02-01T10:00:00.000Z',
    logLevel: 'INFO',
    message: 'Started testcase --->> Source: Salesforce, Account; Target: NetSuite, Customer; Project: DEFAULT, PRODUCTION',
    logClass: 'com.opshub.automation.TestRunner',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 2,
    timeStamp: '2024-02-01T10:00:05.000Z',
    logLevel: 'INFO',
    message: 'Start synchronizing of Entity Id ACC-001 with revision 1 EI ACC-001-REV-1',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 3,
    timeStamp: '2024-02-01T10:00:10.000Z',
    logLevel: 'INFO',
    message: 'About to tranform New Values EI ACC-001-REV-1',
    logClass: 'com.opshub.automation.TransformationEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 4,
    timeStamp: '2024-02-01T10:00:15.000Z',
    logLevel: 'DEBUG',
    message: `Source XML START
<?xml version="1.0" encoding="UTF-8"?>
<Account>
  <Id>ACC-001</Id>
  <Name>Acme Corporation</Name>
  <Industry>Technology</Industry>
  <AnnualRevenue>5000000</AnnualRevenue>
</Account>
Source XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 5,
    timeStamp: '2024-02-01T10:00:20.000Z',
    logLevel: 'DEBUG',
    message: `Transformed XML START
<?xml version="1.0" encoding="UTF-8"?>
<Customer>
  <EntityID>CUST-001</EntityID>
  <CompanyName>Acme Corporation</CompanyName>
  <Industry>Technology</Industry>
  <AnnualRev>5000000</AnnualRev>
  <Status>ACTIVE</Status>
</Customer>
Transformed XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 6,
    timeStamp: '2024-02-01T10:00:25.000Z',
    logLevel: 'INFO',
    message: 'Created entity information: internalId=CUST-001, displayId=CUST-ACME-001 EI ACC-001-REV-1',
    logClass: 'com.opshub.automation.EntityCreator',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 7,
    timeStamp: '2024-02-01T10:00:30.000Z',
    logLevel: 'INFO',
    message: 'Finished synchronizing of Entity Id ACC-001 with revision 1 EI ACC-001-REV-1 - Status: SUCCESS',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
];

/**
 * Multiple sync cycles: Two entities synchronized sequentially
 * This tests the parser's ability to handle multiple syncs
 */
export const getMultipleSyncsTestLogs = (): LogEntry[] => [
  {
    id: 1,
    timeStamp: '2024-02-01T10:00:00.000Z',
    logLevel: 'INFO',
    message: 'Started testcase --->> Source: Salesforce, Contact; Target: NetSuite, Contact; Project: DEFAULT, PRODUCTION',
    logClass: 'com.opshub.automation.TestRunner',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  // First entity sync
  {
    id: 2,
    timeStamp: '2024-02-01T10:00:05.000Z',
    logLevel: 'INFO',
    message: 'Start synchronizing of Entity Id CON-001 with revision 1 EI CON-001-REV-1',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 3,
    timeStamp: '2024-02-01T10:00:10.000Z',
    logLevel: 'INFO',
    message: 'About to tranform New Values EI CON-001-REV-1',
    logClass: 'com.opshub.automation.TransformationEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 4,
    timeStamp: '2024-02-01T10:00:15.000Z',
    logLevel: 'DEBUG',
    message: `Source XML START
<?xml version="1.0" encoding="UTF-8"?>
<Contact>
  <Id>CON-001</Id>
  <FirstName>John</FirstName>
  <LastName>Smith</LastName>
  <Email>john.smith@acme.com</Email>
</Contact>
Source XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 5,
    timeStamp: '2024-02-01T10:00:20.000Z',
    logLevel: 'DEBUG',
    message: `Transformed XML START
<?xml version="1.0" encoding="UTF-8"?>
<Contact>
  <EntityID>CONTACT-001</EntityID>
  <FirstName>John</FirstName>
  <LastName>Smith</LastName>
  <EmailAddress>john.smith@acme.com</EmailAddress>
  <Status>ACTIVE</Status>
</Contact>
Transformed XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 6,
    timeStamp: '2024-02-01T10:00:25.000Z',
    logLevel: 'INFO',
    message: 'Created entity information: internalId=CONTACT-001, displayId=CONTACT-JOHN-001 EI CON-001-REV-1',
    logClass: 'com.opshub.automation.EntityCreator',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 7,
    timeStamp: '2024-02-01T10:00:30.000Z',
    logLevel: 'INFO',
    message: 'Finished synchronizing of Entity Id CON-001 with revision 1 EI CON-001-REV-1 - Status: SUCCESS',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  // Second entity sync
  {
    id: 8,
    timeStamp: '2024-02-01T10:01:00.000Z',
    logLevel: 'INFO',
    message: 'Start synchronizing of Entity Id CON-002 with revision 1 EI CON-002-REV-1',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 9,
    timeStamp: '2024-02-01T10:01:05.000Z',
    logLevel: 'INFO',
    message: 'About to tranform New Values EI CON-002-REV-1',
    logClass: 'com.opshub.automation.TransformationEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 10,
    timeStamp: '2024-02-01T10:01:10.000Z',
    logLevel: 'DEBUG',
    message: `Source XML START
<?xml version="1.0" encoding="UTF-8"?>
<Contact>
  <Id>CON-002</Id>
  <FirstName>Jane</FirstName>
  <LastName>Doe</LastName>
  <Email>jane.doe@acme.com</Email>
</Contact>
Source XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 11,
    timeStamp: '2024-02-01T10:01:15.000Z',
    logLevel: 'DEBUG',
    message: `Transformed XML START
<?xml version="1.0" encoding="UTF-8"?>
<Contact>
  <EntityID>CONTACT-002</EntityID>
  <FirstName>Jane</FirstName>
  <LastName>Doe</LastName>
  <EmailAddress>jane.doe@acme.com</EmailAddress>
  <Status>ACTIVE</Status>
</Contact>
Transformed XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 12,
    timeStamp: '2024-02-01T10:01:20.000Z',
    logLevel: 'INFO',
    message: 'Created entity information: internalId=CONTACT-002, displayId=CONTACT-JANE-002 EI CON-002-REV-1',
    logClass: 'com.opshub.automation.EntityCreator',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 13,
    timeStamp: '2024-02-01T10:01:25.000Z',
    logLevel: 'INFO',
    message: 'Finished synchronizing of Entity Id CON-002 with revision 1 EI CON-002-REV-1 - Status: SUCCESS',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
];

/**
 * Failed sync with error in transformed XML
 * This tests error detection in parsed data
 */
export const getFailedSyncTestLogs = (): LogEntry[] => [
  {
    id: 1,
    timeStamp: '2024-02-01T10:00:00.000Z',
    logLevel: 'INFO',
    message: 'Started testcase --->> Source: Salesforce, Account; Target: NetSuite, Account; Project: DEFAULT, PRODUCTION',
    logClass: 'com.opshub.automation.TestRunner',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 2,
    timeStamp: '2024-02-01T10:00:05.000Z',
    logLevel: 'INFO',
    message: 'Start synchronizing of Entity Id ACC-BAD with revision 1 EI ACC-BAD-REV-1',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 3,
    timeStamp: '2024-02-01T10:00:10.000Z',
    logLevel: 'INFO',
    message: 'About to tranform New Values EI ACC-BAD-REV-1',
    logClass: 'com.opshub.automation.TransformationEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 4,
    timeStamp: '2024-02-01T10:00:15.000Z',
    logLevel: 'DEBUG',
    message: `Source XML START
<?xml version="1.0" encoding="UTF-8"?>
<Account>
  <Id>ACC-BAD</Id>
  <Name>Invalid Corporation</Name>
</Account>
Source XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 5,
    timeStamp: '2024-02-01T10:00:20.000Z',
    logLevel: 'ERROR',
    message: `Transformed XML START
<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Validation failed: Missing required field IndustryType</message>
  <code>VALIDATION_ERROR</code>
  <status>FAILED</status>
</error>
Transformed XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 6,
    timeStamp: '2024-02-01T10:00:25.000Z',
    logLevel: 'ERROR',
    message: 'Finished synchronizing of Entity Id ACC-BAD with revision 1 EI ACC-BAD-REV-1 - Status: FAILED',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
];

/**
 * Incomplete sync: Missing finished marker
 * This tests handling of incomplete/stuck syncs
 */
export const getIncompleteSyncTestLogs = (): LogEntry[] => [
  {
    id: 1,
    timeStamp: '2024-02-01T10:00:00.000Z',
    logLevel: 'INFO',
    message: 'Started testcase --->> Source: Salesforce, Task; Target: NetSuite, Task; Project: DEFAULT, PRODUCTION',
    logClass: 'com.opshub.automation.TestRunner',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 2,
    timeStamp: '2024-02-01T10:00:05.000Z',
    logLevel: 'INFO',
    message: 'Start synchronizing of Entity Id TASK-001 with revision 1 EI TASK-001-REV-1',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 3,
    timeStamp: '2024-02-01T10:00:10.000Z',
    logLevel: 'INFO',
    message: 'About to tranform New Values EI TASK-001-REV-1',
    logClass: 'com.opshub.automation.TransformationEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 4,
    timeStamp: '2024-02-01T10:00:15.000Z',
    logLevel: 'DEBUG',
    message: `Source XML START
<?xml version="1.0" encoding="UTF-8"?>
<Task>
  <Id>TASK-001</Id>
  <Title>Implement Log Parser</Title>
</Task>
Source XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  // Missing transformed XML and finished marker
  {
    id: 5,
    timeStamp: '2024-02-01T10:01:00.000Z',
    logLevel: 'WARN',
    message: 'Sync operation appears to be stuck, no progress for 45 seconds EI TASK-001-REV-1',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
];

/**
 * Revision 2 (retry): Same entity synchronized again
 * This tests handling of multiple revisions per entity
 */
export const getRevisionRetryTestLogs = (): LogEntry[] => [
  {
    id: 1,
    timeStamp: '2024-02-01T10:00:00.000Z',
    logLevel: 'INFO',
    message: 'Started testcase --->> Source: Salesforce, Account; Target: NetSuite, Account; Project: DEFAULT, PRODUCTION',
    logClass: 'com.opshub.automation.TestRunner',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  // Revision 1 (failed)
  {
    id: 2,
    timeStamp: '2024-02-01T10:00:05.000Z',
    logLevel: 'INFO',
    message: 'Start synchronizing of Entity Id ACC-RETRY with revision 1 EI ACC-RETRY-REV-1',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 3,
    timeStamp: '2024-02-01T10:00:10.000Z',
    logLevel: 'INFO',
    message: 'About to tranform New Values EI ACC-RETRY-REV-1',
    logClass: 'com.opshub.automation.TransformationEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 4,
    timeStamp: '2024-02-01T10:00:15.000Z',
    logLevel: 'DEBUG',
    message: `Source XML START
<?xml version="1.0" encoding="UTF-8"?>
<Account><Id>ACC-RETRY</Id></Account>
Source XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 5,
    timeStamp: '2024-02-01T10:00:20.000Z',
    logLevel: 'ERROR',
    message: `Transformed XML START
<?xml version="1.0" encoding="UTF-8"?>
<error>Connection timeout</error>
Transformed XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 6,
    timeStamp: '2024-02-01T10:00:25.000Z',
    logLevel: 'ERROR',
    message: 'Finished synchronizing of Entity Id ACC-RETRY with revision 1 EI ACC-RETRY-REV-1 - Status: FAILED',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  // Revision 2 (retry - successful)
  {
    id: 7,
    timeStamp: '2024-02-01T10:01:00.000Z',
    logLevel: 'INFO',
    message: 'Start synchronizing of Entity Id ACC-RETRY with revision 2 EI ACC-RETRY-REV-2',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 8,
    timeStamp: '2024-02-01T10:01:05.000Z',
    logLevel: 'INFO',
    message: 'About to tranform New Values EI ACC-RETRY-REV-2',
    logClass: 'com.opshub.automation.TransformationEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 9,
    timeStamp: '2024-02-01T10:01:10.000Z',
    logLevel: 'DEBUG',
    message: `Source XML START
<?xml version="1.0" encoding="UTF-8"?>
<Account><Id>ACC-RETRY</Id><Name>Retry Corp</Name></Account>
Source XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 10,
    timeStamp: '2024-02-01T10:01:15.000Z',
    logLevel: 'DEBUG',
    message: `Transformed XML START
<?xml version="1.0" encoding="UTF-8"?>
<Account><EntityID>ACC-RETRY-2</EntityID><Name>Retry Corp</Name><Status>ACTIVE</Status></Account>
Transformed XML END`,
    logClass: 'com.opshub.automation.XMLParser',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 11,
    timeStamp: '2024-02-01T10:01:20.000Z',
    logLevel: 'INFO',
    message: 'Created entity information: internalId=ACC-RETRY-2, displayId=ACC-RETRY-CORP EI ACC-RETRY-REV-2',
    logClass: 'com.opshub.automation.EntityCreator',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
  {
    id: 12,
    timeStamp: '2024-02-01T10:01:25.000Z',
    logLevel: 'INFO',
    message: 'Finished synchronizing of Entity Id ACC-RETRY with revision 2 EI ACC-RETRY-REV-2 - Status: SUCCESS',
    logClass: 'com.opshub.automation.SyncEngine',
    testcaseId: 'cee6cd52',
    jenkinsServer: 'jenkins-prod-01',
  },
];

/**
 * Test utility: Get logs by scenario
 */
export const getTestLogsByScenario = (scenario: 'complete' | 'multiple' | 'failed' | 'incomplete' | 'retry') => {
  switch (scenario) {
    case 'complete':
      return getCompleteTestLogs();
    case 'multiple':
      return getMultipleSyncsTestLogs();
    case 'failed':
      return getFailedSyncTestLogs();
    case 'incomplete':
      return getIncompleteSyncTestLogs();
    case 'retry':
      return getRevisionRetryTestLogs();
    default:
      return getCompleteTestLogs();
  }
};
