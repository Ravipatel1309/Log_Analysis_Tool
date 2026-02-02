/**
 * Mock AI responses for the chat interface
 * 
 * TODO: Replace with actual AI backend integration (OpenAI, Gemini, or custom LLM)
 */

// Simulated AI responses based on keywords in user queries
const AI_RESPONSES: Record<string, string[]> = {
  error: [
    `Based on my analysis of your logs, I found **3 critical errors**:

1. **Database Connection Timeout** (Line 142)
   - The connection pool appears exhausted
   - Recommendation: Increase pool size or add connection timeout handling

2. **XML Parsing Error** (Line 287)
   - Malformed XML received from the source system
   - Recommendation: Add XML validation before processing

3. **API Request Failure** (Line 456)
   - Status 500 from external service
   - Recommendation: Implement retry logic with exponential backoff

Would you like me to provide specific code suggestions for any of these issues?`,
    
    `I've analyzed the error patterns in your testcase logs. Here's what I found:

📊 **Error Summary**
- Total errors: 7
- Unique error types: 3
- Most frequent: ConnectionTimeout (4 occurrences)

🔍 **Root Cause Analysis**
The errors cluster around timestamps 10:15-10:20, suggesting a transient infrastructure issue. The database connection pool shows signs of exhaustion.

💡 **Recommended Actions**
1. Check database server health during that time window
2. Review connection pool configuration
3. Add circuit breaker pattern for external calls`,
  ],

  warn: [
    `I've identified several warning patterns that deserve attention:

⚠️ **Memory Usage Warnings** (5 occurrences)
- Memory consistently above 85%
- Garbage collection frequency increasing
- Suggestion: Profile memory usage, check for leaks

⚠️ **Slow Query Warnings** (3 occurrences)
- Queries exceeding 3s threshold
- Tables involved: events, transformations
- Suggestion: Add indexes, optimize query plans

⚠️ **Deprecated API Usage** (2 occurrences)
- Using v1 API endpoints marked for deprecation
- Suggestion: Migrate to v2 endpoints before Q3`,
  ],

  performance: [
    `📈 **Performance Analysis Report**

**Execution Timeline**
- Total duration: 47.5 seconds
- Slowest phase: Event transformation (18.2s)
- Fastest phase: Validation (2.1s)

**Bottlenecks Identified**
1. Sequential processing of large batches
2. N+1 query pattern in entity lookup
3. Synchronous XML parsing

**Optimization Suggestions**
- Implement batch processing with parallel threads
- Use eager loading for related entities
- Switch to streaming XML parser for large documents

**Expected Improvement**: 40-60% reduction in execution time`,
  ],

  default: [
    `I've analyzed the logs for your testcase. Here's a summary:

📋 **Overview**
- Total log entries: 75
- Time span: 10:00:00 - 10:47:30
- Overall status: Passed with warnings

📊 **Log Distribution**
- INFO: 45 (60%)
- DEBUG: 18 (24%)
- WARN: 8 (11%)
- ERROR: 4 (5%)

🔍 **Key Observations**
1. Execution followed expected flow
2. Minor performance degradation mid-execution
3. All critical validations passed

Would you like me to focus on any specific aspect of the logs?`,
    
    `Hello! I'm your AI log analysis assistant. I can help you with:

🔍 **Log Analysis**
- Identify error patterns
- Find root causes
- Detect anomalies

📊 **Performance Insights**
- Execution timeline analysis
- Bottleneck identification
- Optimization suggestions

🔗 **Correlation**
- Cross-reference related events
- Track entity lifecycles
- Map transformation flows

What would you like to explore in your testcase logs?`,
  ],
};

/**
 * Generate a mock AI response based on user input
 * @param userMessage - The user's query
 * @returns A simulated AI response
 */
export const getMockAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for specific keywords and return relevant responses
  if (lowerMessage.includes('error') || lowerMessage.includes('fail') || lowerMessage.includes('exception')) {
    const responses = AI_RESPONSES.error;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMessage.includes('warn') || lowerMessage.includes('warning')) {
    const responses = AI_RESPONSES.warn;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMessage.includes('performance') || lowerMessage.includes('slow') || lowerMessage.includes('time')) {
    const responses = AI_RESPONSES.performance;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Default response
  const responses = AI_RESPONSES.default;
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Simulate AI response delay
 * @param ms - Delay in milliseconds
 */
export const simulateAIDelay = (ms: number = 1500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
