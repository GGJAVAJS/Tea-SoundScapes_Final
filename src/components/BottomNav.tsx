import { Home, Shield, BarChart2, User, Users } from 'lucide-react';
import { TabIndex } from '../types';

interface BottomNavProps {
  activeTab: TabIndex;
  onChange: (tab: TabIndex) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'guardian', label: 'Guardião', icon: Shield },
    { id: 'community', label: 'Social', icon: Users },
    { id: 'diary', label: 'Diário', icon: BarChart2 },
    { id: 'profile', label: 'Eu', icon: User },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 z-40 bg-gradient-to-t from-[#050b14] via-[#050b14]/90 to-transparent pt-12 pointer-events-none">
      <div className="glass-card rounded-full flex justify-between items-center px-6 py-3 max-w-md mx-auto pointer-events-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id as TabIndex)}
              className="flex flex-col items-center justify-center gap-1 w-16 relative"
            >
              {isActive && (
                <div className="absolute inset-0 bg-accent-blue/20 blur-xl rounded-full scale-150 z-0" />
              )}
              <Icon 
                name={label} 
                className={`w-6 h-6 z-10 transition-colors duration-300 ${isActive ? 'text-accent-blue' : 'text-gray-400'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] z-10 transition-colors duration-300 ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
