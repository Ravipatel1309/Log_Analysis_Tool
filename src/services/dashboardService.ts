/**
 * Dashboard Service - Handles dashboard data fetching
 * 
 * TODO: Replace mock data with actual API calls to analytics backend
 */

import { DashboardStats, TestcaseSummary, EntityLifecycle, EventXMLData, ApiResponse } from '@/types';
import { 
  getDashboardStats as getMockStats, 
  getTestcaseSummary as getMockSummary,
  getEntityLifecycleData as getMockLifecycle,
  getEventXMLData as getMockXML,
} from '@/mockData/testcases';

/**
 * Fetch dashboard statistics for a testcase
 * 
 * TODO: Replace with aggregation API call
 * Example: GET /api/dashboard/stats?testcaseId={testcaseId}
 */
export const fetchDashboardStats = async (testcaseId: string): Promise<ApiResponse<DashboardStats>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    data: await getMockStats(testcaseId),
    success: true,
  };
};

/**
 * Fetch testcase summary
 * 
 * TODO: Replace with test management API call
 */
export const fetchTestcaseSummary = async (testcaseId: string): Promise<ApiResponse<TestcaseSummary>> => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return {
    data: await getMockSummary(testcaseId),
    success: true,
  };
};

/**
 * Fetch entity lifecycle data for timeline chart
 * 
 * TODO: Replace with time-series API call
 * Example: GET /api/analytics/lifecycle?testcaseId={testcaseId}&interval=1m
 */
export const fetchEntityLifecycle = async (testcaseId: string): Promise<ApiResponse<EntityLifecycle[]>> => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  return {
    data: await getMockLifecycle(testcaseId),
    success: true,
  };
};

/**
 * Fetch XML event comparison data
 * 
 * TODO: Replace with event store API call
 */
export const fetchEventXMLData = async (testcaseId: string): Promise<ApiResponse<EventXMLData[]>> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    data: await getMockXML(testcaseId),
    success: true,
  };
};
