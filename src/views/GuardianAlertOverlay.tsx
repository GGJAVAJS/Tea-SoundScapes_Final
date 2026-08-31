import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onAccept: () => void;
  onDismiss: () => void;
}

export function GuardianAlertOverlay({ isOpen, onAccept, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#02050b]/80 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass-card-active p-6 w-full max-w-sm flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_40px_rgba(56,189,248,0.2)]"
          >
             <div className="absolute top-0 left-0 right-0 h-1 bg-accent-blue animate-pulse" />
             <div className="w-20 h-20 rounded-full bg-accent-blue/10 flex items-center justify-center mb-4 relative">
               <div className="absolute inset-0 border border-accent-blue/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
               <ShieldAlert className="w-10 h-10 text-accent-blue" />
             </div>
             <h2 className="text-xl font-medium text-white mb-2">Pico Sonoro Detectado</h2>
             <p className="text-gray-400 text-sm mb-8 leading-relaxed">
               O Sistema Guardião identificou níveis elevados de ruído no ambiente. Deseja ativar seu Refúgio Sonoro?
             </p>
             <div className="flex gap-3 w-full font-medium">
               <button onClick={onDismiss} className="flex-1 py-3.5 glass-card text-white hover:bg-white/5 active:scale-95 transition-all">
                 Agora não
               </button>
               <button onClick={onAccept} className="flex-1 py-3.5 bg-accent-blue text-white rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:scale-105 active:scale-95 transition-all">
                 Ativar Refúgio
               </button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
