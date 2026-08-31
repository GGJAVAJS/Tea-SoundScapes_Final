import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EmergencySmsOverlayProps {
  isOpen: boolean;
  onClose: (sendSms: boolean) => void;
}

export function EmergencySmsOverlay({ isOpen, onClose }: EmergencySmsOverlayProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#1a1a24] border border-red-500/30 rounded-3xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Aviso contato de Emergência?</h2>
          <p className="text-gray-300 mb-8">
            Enviar uma mensagem aos seus contatos de emergência?
          </p>

          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={() => onClose(true)} 
              className="bg-red-500 hover:bg-red-600 outline-none text-white font-bold py-4 rounded-xl w-full flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-5 h-5" />
              SIM, avisar
            </button>
            <button 
              onClick={() => onClose(false)} 
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-medium py-3 rounded-xl w-full transition-colors"
            >
              NÃO AVISAR
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
