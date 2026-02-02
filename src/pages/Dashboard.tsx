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
  Activity,
} from 'lucide-react';
import { APP_CONFIG, STATUS_CONFIG } from '@/config/appConfig';
import { DashboardStats, EntityLifecycle } from '@/types';
import {
  fetchDashboardStats,
  fetchEntityLifecycle,
} from '@/services/dashboardService';
import { formatDuration, formatNumber } from '@/utils/formatters';
import { StatWidget } from '@/components/dashboard/StatWidget';
import { LifecycleChart } from '@/components/dashboard/LifecycleChart';
import { EntityDetailsTable } from '@/components/dashboard/EntityDetailsTable';
import { getMockEntityDetails } from '@/mockData/entityDetails';
import { cn } from '@/lib/utils';

/**
 * Dashboard page component
 */
const Dashboard = () => {
  const { testcaseId } = useParams<{ testcaseId: string }>();
  const navigate = useNavigate();
  
  // Redirect to default testcase if none specified
  const currentTestcaseId = testcaseId || APP_CONFIG.defaultTestcaseId;
  
  // State for dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lifecycle, setLifecycle] = useState<EntityLifecycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data when testcaseId changes
  useEffect(() => {
    if (!testcaseId) {
      navigate(`/dashboard/${APP_CONFIG.defaultTestcaseId}`, { replace: true });
      return;
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API calls
        const [statsRes, lifecycleRes] = await Promise.all([
          fetchDashboardStats(currentTestcaseId),
          fetchEntityLifecycle(currentTestcaseId),
        ]);
        
        setStats(statsRes.data);
        setLifecycle(lifecycleRes.data);
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
    if (!stats) return null;
    const config = STATUS_CONFIG[stats.testcaseStatus];
    const Icon = stats.testcaseStatus === 'PASSED' ? CheckCircle : XCircle;
    
    return (
      <div className={cn('flex items-center gap-2', config.className)}>
        <Icon className="h-5 w-5" />
        <span className="font-semibold">{config.label}</span>
      </div>
    );
  };

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
        {stats && (
          <div className="flex items-center gap-4">
            {getStatusDisplay()}
          </div>
        )}
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatWidget
          title="Total Logs"
          value={stats ? formatNumber(stats.totalLogs) : '—'}
          icon={FileText}
          variant="info"
          subtitle="All log entries"
        />
        <StatWidget
          title="Errors"
          value={stats ? formatNumber(stats.errorCount) : '—'}
          icon={AlertCircle}
          variant="error"
          subtitle="Critical issues"
        />
        <StatWidget
          title="Warnings"
          value={stats ? formatNumber(stats.warnCount) : '—'}
          icon={AlertTriangle}
          variant="warning"
          subtitle="Attention needed"
        />
        <StatWidget
          title="Info Logs"
          value={stats ? formatNumber(stats.infoCount) : '—'}
          icon={Info}
          variant="default"
          subtitle="Informational"
        />
        <StatWidget
          title="Duration"
          value={stats ? formatDuration(stats.executionDuration) : '—'}
          icon={Clock}
          variant="default"
          subtitle="Execution time"
        />
      </div>

      {/* Lifecycle Chart */}
      <LifecycleChart data={lifecycle} isLoading={isLoading} />

      {/* Entity Details Table */}
      <EntityDetailsTable entityDetails={getMockEntityDetails()} />
    </div>
  );
};

export default Dashboard;
