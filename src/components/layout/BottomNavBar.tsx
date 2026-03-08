import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Map, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface NavTab {
  key: string;
  label: string;
  icon?: React.ElementType;
  path: string;
  isAvatar?: boolean;
  badgeCount?: number;
}

const getInitials = (name: string | null | undefined) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

export const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const tabs: NavTab[] = [
    { key: 'home', label: 'Accueil', icon: Home, path: '/' },
    { key: 'search', label: 'Recherche', icon: Search, path: '/search' },
    { key: 'map', label: 'Carte', icon: Map, path: '/map/providers' },
    { key: 'ai', label: 'IA Chat', icon: Bot, path: '/medical-assistant', badgeCount: 3 },
    { key: 'profile', label: 'Profil', path: '/profile', isAvatar: true },
  ];

  const isActive = (tab: NavTab) => {
    if (tab.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[430px]">
        <div className="bg-[#1A1A1A] h-16 flex items-center">
          {tabs.map((tab) => {
            const active = isActive(tab);
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-transform duration-100 active:scale-90"
                aria-label={tab.label}
              >
                {tab.isAvatar ? (
                  <Avatar className={cn(
                    'h-8 w-8 transition-all',
                    active && 'ring-2 ring-[#2B7FFF] ring-offset-1 ring-offset-[#1A1A1A]'
                  )}>
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'Avatar'} />
                    ) : null}
                    <AvatarFallback className="bg-[#3A3A3A] text-white text-xs font-bold">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="relative">
                    {Icon && (
                      <Icon
                        className="h-6 w-6"
                        color={active ? '#2B7FFF' : '#FFFFFF'}
                        strokeWidth={active ? 2.5 : 1.5}
                      />
                    )}
                    {tab.badgeCount && tab.badgeCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center bg-[#2B7FFF] rounded-full">
                        <span className="text-[10px] font-bold text-white leading-none">
                          {tab.badgeCount}
                        </span>
                      </span>
                    )}
                  </div>
                )}
                <span
                  className={cn(
                    'text-[11px] font-bold leading-none',
                    active ? 'text-[#2B7FFF]' : 'text-white'
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* Bottom safe area */}
        <div className="bg-[#1A1A1A] h-[env(safe-area-inset-bottom,16px)] min-h-4" />
      </div>
    </nav>
  );
};
