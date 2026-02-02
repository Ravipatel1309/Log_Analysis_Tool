/**
 * Dashboard Page - High-level overview of testcase execution
 * Displays summary widgets, lifecycle chart, and XML comparison table
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { APP_CONFIG, STATUS_CONFIG } from '@/config/appConfig';
import { EntityDetails } from '@/types';
import { fetchLogs } from '@/services/logService';
import { parseLogs, ParsedDashboardResult } from '@/services/logParser';
import { formatDuration, formatNumber } from '@/utils/formatters';
import { StatWidget } from '@/components/dashboard/StatWidget';
import { LifecycleChart } from '@/components/dashboard/LifecycleChart';
import { EntityDetailsTable } from '@/components/dashboard/EntityDetailsTable';
import { cn } from '@/lib/utils';

/**
 * Dashboard page component
 */
const Dashboard = () => {
  const { testcaseId } = useParams<{ testcaseId: string }>();
  const navigate = useNavigate();
  
  // Redirect to default testcase if none specified
  const currentTestcaseId = testcaseId || APP_CONFIG.defaultTestcaseId;
  
  // State for parsed dashboard data
  const [entityDetails, setEntityDetails] = useState<EntityDetails | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedDashboardResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch and parse logs when testcaseId changes
  useEffect(() => {
    if (!testcaseId) {
      navigate(`/dashboard/${APP_CONFIG.defaultTestcaseId}`, { replace: true });
      return;
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch raw logs
        const logsRes = await fetchLogs(currentTestcaseId);
        
        if (!logsRes.data || logsRes.data.length === 0) {
          console.warn('No logs found for testcase:', currentTestcaseId);
          setIsLoading(false);
          return;
        }

        // Parse logs on frontend
        const result = parseLogs(logsRes.data);
        
        if (result) {
          setParsedResult(result);
          setEntityDetails(result.entityDetails);
        } else {
          console.warn('Failed to parse logs');
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentTestcaseId, testcaseId, navigate]);

  // Get status icon and styling
  const getStatusDisplay = () => {
    if (!parsedResult?.widgetMetrics) {
      return null;
    }

    // Status is FAILED if there are error level logs (including "Test Invocation Failure")
    const hasErrors = parsedResult.widgetMetrics.errorLevelLogsCount > 0;
    
    const status = hasErrors ? 'FAILED' : 'PASSED';
    const config = STATUS_CONFIG[status];
    const Icon = status === 'PASSED' ? CheckCircle : XCircle;
    
    return (
      <div className={cn('flex items-center gap-2', config.className)}>
        <Icon className="h-5 w-5" />
        <span className="font-semibold">{config.label}</span>
      </div>
    );
  };

  // Calculate stats from parsed data
  const stats = parsedResult?.widgetMetrics ? {
    totalSyncs: parsedResult.widgetMetrics.totalSyncs,
    successfulSyncs: parsedResult.widgetMetrics.successfulSyncs,
    failedSyncs: parsedResult.widgetMetrics.failedSyncs,
    errorLevelLogsCount: parsedResult.widgetMetrics.errorLevelLogsCount,
    executionDuration: parsedResult.widgetMetrics.executionTimeMs,
  } : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Execution overview for testcase:{' '}
            <span className="font-mono text-primary">{currentTestcaseId}</span>
          </p>
        </div>
        {parsedResult && (
          <div className="flex items-center gap-4">
            {getStatusDisplay()}
          </div>
        )}
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatWidget
          title="Total Syncs"
          value={stats ? formatNumber(stats.totalSyncs) : '—'}
          icon={FileText}
          variant="info"
          subtitle="Sync operations"
        />
        <StatWidget
          title="Successful"
          value={stats ? formatNumber(stats.successfulSyncs) : '—'}
          icon={CheckCircle}
          variant="default"
          subtitle="Completed syncs"
        />
        <StatWidget
          title="Failed"
          value={stats ? formatNumber(stats.failedSyncs) : '—'}
          icon={AlertCircle}
          variant="error"
          subtitle="Failed syncs"
        />
        <StatWidget
          title="Error Logs"
          value={stats ? formatNumber(stats.errorLevelLogsCount) : '—'}
          icon={AlertTriangle}
          variant="error"
          subtitle="Error level logs"
        />
        <StatWidget
          title="Duration"
          value={stats ? formatDuration(stats.executionDuration) : '—'}
          icon={Clock}
          variant="default"
          subtitle="Execution time"
        />
      </div>

      {/* Lifecycle Chart - No longer needed with parsed data */}
      {/* Chart will be updated to show sync timeline from parsedResult */}

      {/* Entity Details Table - Now fed by parsed data */}
      {entityDetails && <EntityDetailsTable entityDetails={entityDetails} />}
      {!entityDetails && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          No sync data found in logs for this testcase.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
