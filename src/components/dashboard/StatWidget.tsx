/**
 * StatWidget - Premium dashboard statistics widget
 * Features gradients, glows, and smooth animations
 */

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatWidgetProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
  className?: string;
}

const variantStyles = {
  default: 'widget-card border-border/50',
  success: 'widget-success border-status-success/30',
  warning: 'widget-warning border-log-warn/30',
  error: 'widget-error border-log-error/30',
  info: 'widget-info border-log-info/30',
};

const iconGradients = {
  default: 'from-primary to-secondary',
  success: 'from-status-success to-[hsl(165_70%_45%)]',
  warning: 'from-log-warn to-[hsl(30_90%_50%)]',
  error: 'from-log-error to-[hsl(350_75%_50%)]',
  info: 'from-log-info to-[hsl(190_90%_50%)]',
};

const iconGlows = {
  default: 'shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
  success: 'shadow-[0_0_20px_hsl(var(--status-success)/0.3)]',
  warning: 'shadow-[0_0_20px_hsl(var(--log-warn)/0.3)]',
  error: 'shadow-[0_0_20px_hsl(var(--log-error)/0.3)]',
  info: 'shadow-[0_0_20px_hsl(var(--log-info)/0.3)]',
};

/**
 * Premium statistic widget with visual hierarchy
 */
export const StatWidget = ({
  title,
  value,
  icon: Icon,
  variant = 'default',
  subtitle,
  className,
}: StatWidgetProps) => {
  return (
    <div
      className={cn(
        'rounded-xl p-5 border transition-all duration-300',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/80 mt-2 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-accent" />
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            'p-3 rounded-xl bg-gradient-to-br',
            iconGradients[variant],
            iconGlows[variant]
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
};
