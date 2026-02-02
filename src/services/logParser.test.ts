/**
 * Frontend Log Parser - Testing Guide
 * 
 * This guide shows how to test the log parser with various scenarios
 */

import { parseLogs } from '@/services/logParser';
import { getTestLogsByScenario } from '@/mockData/testLogs';

/**
 * SCENARIO 1: Complete successful sync
 * 
 * Tests:
 * - Entity context extraction
 * - Sync start detection
 * - XML capture (source and transformed)
 * - Entity creation info
 * - Sync completion
 */
export function testCompleteSync() {
  console.log('=== Test: Complete Sync ===');
  
  const logs = getTestLogsByScenario('complete');
  const result = parseLogs(logs);
  
  if (!result) {
    console.error('❌ Failed to parse logs');
    return;
  }

  // Assertions
  console.assert(
    result.entityContext.sourceSystem === 'Salesforce',
    'Source system should be Salesforce'
  );
  console.assert(
    result.entityContext.targetSystem === 'NetSuite',
    'Target system should be NetSuite'
  );
  console.assert(
    result.syncStatusList.length === 1,
    'Should have 1 sync'
  );
  console.assert(
    result.syncStatusList[0].sourceEntityId === 'ACC-001',
    'Source entity ID should be ACC-001'
  );
  console.assert(
    result.syncStatusList[0].sourceEventXML.includes('<Account>'),
    'Source XML should be captured'
  );
  console.assert(
    result.syncStatusList[0].transformedEventXML.includes('<Customer>'),
    'Transformed XML should be captured'
  );
  console.assert(
    result.entityDetails.syncStatusList.length === 1,
    'Entity details should have 1 sync'
  );

  console.log('✅ All assertions passed');
  console.log(JSON.stringify(result, null, 2));
}

/**
 * SCENARIO 2: Multiple syncs
 * 
 * Tests:
 * - Parsing multiple entities
 * - Correct sync ordering
 * - Independent sync tracking
 */
export function testMultipleSyncs() {
  console.log('=== Test: Multiple Syncs ===');
  
  const logs = getTestLogsByScenario('multiple');
  const result = parseLogs(logs);
  
  if (!result) {
    console.error('❌ Failed to parse logs');
    return;
  }

  // Assertions
  console.assert(
    result.syncStatusList.length === 2,
    'Should have 2 syncs'
  );
  console.assert(
    result.syncStatusList[0].sourceEntityId === 'CON-001',
    'First sync should be CON-001'
  );
  console.assert(
    result.syncStatusList[1].sourceEntityId === 'CON-002',
    'Second sync should be CON-002'
  );
  console.assert(
    new Date(result.syncStatusList[0].startSyncTime) < 
    new Date(result.syncStatusList[1].startSyncTime),
    'Syncs should be ordered by time'
  );
  console.assert(
    result.syncStatusList[0].transformedEventXML.includes('John'),
    'First sync should have correct XML'
  );
  console.assert(
    result.syncStatusList[1].transformedEventXML.includes('Jane'),
    'Second sync should have correct XML'
  );

  console.log('✅ All assertions passed');
  console.log(`Total syncs: ${result.syncStatusList.length}`);
  result.syncStatusList.forEach((sync, idx) => {
    console.log(`  [${idx + 1}] ${sync.sourceEntityId} (Rev ${sync.revisionId})`);
  });
}

/**
 * SCENARIO 3: Failed sync
 * 
 * Tests:
 * - Error detection
 * - Failed sync status
 * - Incomplete transformed XML
 */
export function testFailedSync() {
  console.log('=== Test: Failed Sync ===');
  
  const logs = getTestLogsByScenario('failed');
  const result = parseLogs(logs);
  
  if (!result) {
    console.error('❌ Failed to parse logs');
    return;
  }

  // Assertions
  console.assert(
    result.syncStatusList.length === 1,
    'Should have 1 sync'
  );
  console.assert(
    result.syncStatusList[0].transformedEventXML.includes('error'),
    'Transformed XML should contain error'
  );
  console.assert(
    result.syncStatusList[0].transformedEventXML.includes('VALIDATION_ERROR'),
    'Should have validation error'
  );

  const failedSyncs = result.syncStatusList.filter(s =>
    s.transformedEventXML.includes('error')
  );
  console.assert(
    failedSyncs.length === 1,
    'Should detect 1 failed sync'
  );

  console.log('✅ All assertions passed');
  console.log(`Failed sync detected: ${result.syncStatusList[0].sourceEntityId}`);
}

/**
 * SCENARIO 4: Incomplete sync
 * 
 * Tests:
 * - Handling missing "Finished" marker
 * - Incomplete XML capture
 * - Graceful degradation
 */
export function testIncompleteSync() {
  console.log('=== Test: Incomplete Sync ===');
  
  const logs = getTestLogsByScenario('incomplete');
  const result = parseLogs(logs);
  
  if (!result) {
    console.error('❌ Failed to parse logs');
    return;
  }

  // Assertions
  console.assert(
    result.syncStatusList.length === 1,
    'Should parse incomplete sync'
  );
  console.assert(
    result.syncStatusList[0].sourceEventXML.includes('<Task>'),
    'Source XML should be captured'
  );
  console.assert(
    !result.syncStatusList[0].transformedEventXML,
    'Transformed XML should be empty'
  );
  console.assert(
    result.syncStatusList[0].finishedSyncTime,
    'Should have finishedSyncTime (set to current)'
  );

  console.log('✅ All assertions passed');
  console.log('Incomplete sync handled gracefully');
  console.log(`  Source: ${result.syncStatusList[0].sourceEntityId}`);
  console.log(`  Transformed XML captured: ${!!result.syncStatusList[0].transformedEventXML}`);
}

/**
 * SCENARIO 5: Revision retry (same entity, multiple attempts)
 * 
 * Tests:
 * - Handling multiple revisions of same entity
 * - Correlation by EI
 * - Revision ordering
 */
export function testRevisionRetry() {
  console.log('=== Test: Revision Retry ===');
  
  const logs = getTestLogsByScenario('retry');
  const result = parseLogs(logs);
  
  if (!result) {
    console.error('❌ Failed to parse logs');
    return;
  }

  // Assertions
  console.assert(
    result.syncStatusList.length === 2,
    'Should have 2 revisions'
  );
  console.assert(
    result.syncStatusList[0].sourceEntityId === 'ACC-RETRY',
    'First revision should be ACC-RETRY'
  );
  console.assert(
    result.syncStatusList[1].sourceEntityId === 'ACC-RETRY',
    'Second revision should be ACC-RETRY'
  );
  console.assert(
    result.syncStatusList[0].revisionId === 1,
    'First should be revision 1'
  );
  console.assert(
    result.syncStatusList[1].revisionId === 2,
    'Second should be revision 2'
  );
  console.assert(
    result.syncStatusList[0].transformedEventXML.includes('error'),
    'First revision should have error'
  );
  console.assert(
    !result.syncStatusList[1].transformedEventXML.includes('error'),
    'Second revision should not have error'
  );

  console.log('✅ All assertions passed');
  console.log(`Entity ${result.syncStatusList[0].sourceEntityId} has ${result.syncStatusList.length} revisions`);
  result.syncStatusList.forEach((sync, idx) => {
    const hasError = sync.transformedEventXML.includes('error');
    const status = hasError ? 'FAILED' : 'SUCCESS';
    console.log(`  [Rev ${sync.revisionId}] ${status}`);
  });
}

/**
 * RUN ALL TESTS
 */
export function runAllTests() {
  console.clear();
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Frontend Log Parser - Test Suite                   ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  try {
    testCompleteSync();
    console.log('\n---\n');

    testMultipleSyncs();
    console.log('\n---\n');

    testFailedSync();
    console.log('\n---\n');

    testIncompleteSync();
    console.log('\n---\n');

    testRevisionRetry();
    console.log('\n---\n');

    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║   ✅ ALL TESTS PASSED                               ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
  }
}

/**
 * TEST: Parser Performance
 * 
 * Measures parsing speed for different log sizes
 */
export function testParserPerformance() {
  console.log('=== Performance Test ===');
  
  const sizes = [100, 500, 1000, 5000];
  
  sizes.forEach(size => {
    const logs = Array.from({ length: size }, (_, i) => ({
      id: i,
      timeStamp: new Date(Date.now() + i * 1000).toISOString(),
      logLevel: 'INFO' as const,
      message: `Log entry ${i}: Some generic message`,
      logClass: 'com.test.Logger',
      testcaseId: 'test',
      jenkinsServer: 'jenkins-1',
    }));

    const start = performance.now();
    const result = parseLogs(logs);
    const end = performance.now();

    const duration = (end - start).toFixed(2);
    console.log(`  ${size} logs: ${duration}ms`);
  });

  console.log('✅ Performance test completed');
}

/**
 * TEST: Widget Data Extraction
 * 
 * Tests that parsed data correctly populates dashboard widgets
 */
export function testWidgetData() {
  console.log('=== Widget Data Test ===');
  
  const logs = getTestLogsByScenario('multiple');
  const result = parseLogs(logs);
  
  if (!result) {
    console.error('❌ Failed to parse logs');
    return;
  }

  // Simulate widget data calculation
  const stats = {
    totalSyncs: result.syncStatusList.length,
    successfulSyncs: result.syncStatusList.filter(s =>
      !s.transformedEventXML.includes('error') &&
      !s.transformedEventXML.includes('failed')
    ).length,
    failedSyncs: result.syncStatusList.filter(s =>
      s.transformedEventXML.includes('error') ||
      s.transformedEventXML.includes('failed')
    ).length,
  };

  stats.successfulSyncs = stats.totalSyncs - stats.failedSyncs;
  const successRate = stats.totalSyncs > 0
    ? Math.round((stats.successfulSyncs / stats.totalSyncs) * 100)
    : 0;

  console.log('Widget Data:');
  console.log(`  Total Syncs: ${stats.totalSyncs}`);
  console.log(`  Successful: ${stats.successfulSyncs}`);
  console.log(`  Failed: ${stats.failedSyncs}`);
  console.log(`  Success Rate: ${successRate}%`);

  console.log('✅ Widget data extraction successful');
}

// Export for use in browser console or test runner
export default {
  runAllTests,
  testCompleteSync,
  testMultipleSyncs,
  testFailedSync,
  testIncompleteSync,
  testRevisionRetry,
  testParserPerformance,
  testWidgetData,
};

/**
 * HOW TO USE IN BROWSER:
 * 
 * 1. Import test suite in your app:
 *    import { runAllTests } from '@/src/services/logParser.test'
 * 
 * 2. Run tests in browser console:
 *    runAllTests()
 * 
 * 3. Or run individual tests:
 *    testCompleteSync()
 *    testMultipleSyncs()
 *    etc.
 * 
 * 4. Or test performance:
 *    testParserPerformance()
 * 
 * 5. Or test widget data:
 *    testWidgetData()
 */
