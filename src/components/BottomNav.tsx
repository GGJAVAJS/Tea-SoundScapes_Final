import { Home, Shield, BarChart2, User, Users } from 'lucide-react';
import { TabIndex } from '../types';

interface BottomNavProps {
  activeTab: TabIndex;
  onChange: (tab: TabIndex) => void;
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | null;
}

export function BottomNav({ activeTab, onChange, themeMode, kidsTheme }: BottomNavProps) {
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';
  const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';

  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'guardian', label: 'Guardião', icon: Shield },
    { id: 'community', label: 'Social', icon: Users },
    { id: 'diary', label: 'Diário', icon: BarChart2 },
    { id: 'profile', label: 'Eu', icon: User },
  ] as const;

  const isChildMode = themeMode === 'child';

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 z-40 pointer-events-none">
      <div 
        className="glass-card rounded-full flex justify-between items-center px-6 py-3 max-w-md mx-auto pointer-events-auto shadow-2xl border border-white/10 overflow-hidden relative"
        style={{
          backdropFilter: isChildMode ? 'blur(2px)' : 'blur(12px)',
          WebkitBackdropFilter: isChildMode ? 'blur(2px)' : 'blur(12px)',
        }}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id as TabIndex)}
              className="flex flex-col items-center justify-center gap-1 w-16 relative transition-opacity hover:opacity-100"
            >
              {isActive && (
                <div 
                  className={`absolute inset-0 blur-md rounded-full scale-110 z-0 ${
                    isSpaceTheme
                      ? 'bg-[#602EC9]/30' 
                      : isDinoTheme 
                        ? 'bg-[#80F356]/25' 
                        : isCarsTheme ? 'bg-[#FFE838]/20' : 'bg-accent-blue/20'
                  }`} 
                />
              )}
              <Icon 
                name={label} 
                className={`w-6 h-6 z-10 transition-colors duration-300 ${
                  isActive 
                    ? (isSpaceTheme ? 'text-[#602EC9]' : isDinoTheme ? 'text-[#80F356]' : isCarsTheme ? 'text-[#FFE838]' : 'text-accent-blue') 
                    : 'text-gray-300 hover:text-white'
                }`} 
                style={
                  isActive && isSpaceTheme ? { color: '#602EC9' } 
                    : isActive && isDinoTheme 
                      ? { color: 'rgba(128, 243, 86, 0.95)' } 
                      : isActive && isCarsTheme ? { color: '#FFE838' } : isActive ? { color: '#38bdf8' } : undefined
                }
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span 
                className={`text-[11px] z-10 transition-colors duration-300 drop-shadow-sm ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-gray-300 font-medium'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
