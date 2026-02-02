/**
 * AppSidebar - Premium navigation sidebar component
 * Modern design with gradients, glows, and smooth animations
 */

import { NavLink, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { APP_CONFIG, NAV_ITEMS } from '@/config/appConfig';
import { 
  LayoutDashboard, 
  FileText, 
  Bot, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  Terminal,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Icon mapping for navigation items
const iconMap = {
  LayoutDashboard,
  FileText,
  Bot,
  Info,
};

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Premium sidebar navigation with visual hierarchy
 */
export const AppSidebar = ({ collapsed, onToggle }: AppSidebarProps) => {
  const { testcaseId } = useParams<{ testcaseId: string }>();
  const currentTestcaseId = testcaseId || APP_CONFIG.defaultTestcaseId;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen',
        'flex flex-col sidebar-transition sidebar-gradient',
        'border-r border-sidebar-border/50',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo/Brand with glow effect */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border/50">
        <div className="relative">
          <div className="absolute inset-0 blur-lg bg-primary/30 rounded-full" />
          <Terminal className="relative h-7 w-7 text-primary flex-shrink-0" />
        </div>
        {!collapsed && (
          <div className="ml-3 animate-fade-in">
            <span className="font-bold text-foreground whitespace-nowrap tracking-tight">
              {APP_CONFIG.name}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="h-3 w-3 text-accent" />
              <span className="text-[10px] text-sidebar-muted uppercase tracking-widest">
                Pro Edition
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Testcase ID Display with accent styling */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-sidebar-border/50 animate-fade-in">
          <p className="text-[10px] text-sidebar-muted uppercase tracking-widest mb-2">
            Active Testcase
          </p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-sm font-mono text-primary font-medium truncate">
              {currentTestcaseId}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const path = `/${item.path}/${currentTestcaseId}`;

            return (
              <li key={item.path}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 px-3 py-2.5 rounded-lg',
                          'transition-all duration-200 relative',
                          isActive 
                            ? 'nav-active text-foreground font-medium' 
                            : 'text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50',
                          collapsed && 'justify-center'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={cn(
                            'p-1.5 rounded-md transition-all duration-200',
                            isActive 
                              ? 'bg-primary/20 text-primary' 
                              : 'group-hover:bg-sidebar-accent'
                          )}>
                            <Icon className="h-4 w-4 flex-shrink-0" />
                          </div>
                          {!collapsed && (
                            <span className="whitespace-nowrap animate-fade-in text-sm">
                              {item.label}
                            </span>
                          )}
                          {isActive && !collapsed && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent 
                      side="right" 
                      className="font-medium bg-popover border-border shadow-lg"
                    >
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle with premium styling */}
      <div className="p-3 border-t border-sidebar-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            'w-full justify-center gap-2',
            'text-sidebar-muted hover:text-foreground',
            'hover:bg-sidebar-accent/50 transition-all duration-200',
            'border border-transparent hover:border-sidebar-border/50'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};
