import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Map, Bot, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const leftTabs: NavItem[] = [
  { key: 'home', label: 'Accueil', icon: Home, path: '/' },
  { key: 'search', label: 'Recherche', icon: Search, path: '/search' },
];

const rightTabs: NavItem[] = [
  { key: 'ai', label: 'IA Chat', icon: Bot, path: '/medical-assistant' },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const centerTab: NavItem = {
  key: 'map',
  label: 'Carte',
  icon: Map,
  path: '/map',
};

export const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveKey = (): string => {
    if (location.pathname === '/') return 'home';
    if (location.pathname.startsWith('/search')) return 'search';
    if (location.pathname.startsWith('/map')) return 'map';
    if (location.pathname.startsWith('/medical-assistant')) return 'ai';
    if (location.pathname.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeKey = getActiveKey();

  const renderTab = (tab: NavItem) => {
    const isActive = activeKey === tab.key;
    const Icon = tab.icon;

    return (
      <button
        key={tab.key}
        onClick={() => navigate(tab.path)}
        className={cn(
          'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 relative transition-colors duration-200',
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'
        )}
        aria-label={tab.label}
      >
        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.6} />
        <span className={cn(
          'text-[10px] leading-none',
          isActive ? 'font-bold' : 'font-medium'
        )}>
          {tab.label}
        </span>
        {isActive && (
          <motion.div
            layoutId="navIndicator"
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-primary"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </button>
    );
  };

  const isMapActive = activeKey === 'map';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[430px] px-3 pb-[env(safe-area-inset-bottom,4px)] mb-1.5">
        <div className="relative bg-card shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-[22px] h-[64px] flex items-center">
          {/* Left tabs */}
          <div className="flex flex-1">
            {leftTabs.map(renderTab)}
          </div>

          {/* Center diamond button spacer */}
          <div className="w-16 flex-shrink-0" />

          {/* Right tabs */}
          <div className="flex flex-1">
            {rightTabs.map(renderTab)}
          </div>

          {/* Center diamond button - positioned to sit within the bar with slight elevation */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 flex flex-col items-center">
            <motion.button
              onClick={() => navigate(centerTab.path)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'w-12 h-12 rounded-[14px] rotate-45 flex items-center justify-center shadow-lg transition-all duration-300',
                isMapActive
                  ? 'bg-primary shadow-[0_4px_16px_hsl(var(--primary)/0.4)]'
                  : 'bg-primary shadow-[0_4px_12px_hsl(var(--primary)/0.3)]'
              )}
              aria-label={centerTab.label}
            >
              <Plus className="h-6 w-6 text-primary-foreground -rotate-45" strokeWidth={2.5} />
            </motion.button>
            <span className={cn(
              'text-[10px] leading-none mt-1.5',
              isMapActive ? 'font-bold text-primary' : 'font-medium text-muted-foreground'
            )}>
              {centerTab.label}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
