import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, ShieldCheck } from 'lucide-react';

interface PinOverlayProps {
  isOpen: boolean;
  mode: 'create' | 'verify';
  correctPin?: string;
  onSuccess: (pin?: string) => void;
  onCancel: () => void;
}

export function PinOverlay({ isOpen, mode, correctPin, onSuccess, onCancel }: PinOverlayProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setConfirmPin('');
      setStep(1);
      setError(false);
    }
  }, [isOpen]);

  const handleInput = (val: string) => {
    if (mode === 'verify') {
      if (val.length <= 4) {
        setPin(val);
        setError(false);
        
        if (val.length === 4) {
          if (val === correctPin) {
            onSuccess();
            setPin('');
          } else {
            setError(true);
            setTimeout(() => setPin(''), 500);
          }
        }
      }
    } else {
      // Create mode
      if (step === 1) {
        if (val.length <= 4) {
          setPin(val);
          if (val.length === 4) {
            setTimeout(() => setStep(2), 200);
          }
        }
      } else {
        if (val.length <= 4) {
          setConfirmPin(val);
          setError(false);
          
          if (val.length === 4) {
            if (val === pin) {
              onSuccess(pin);
            } else {
              setError(true);
              setTimeout(() => {
                setConfirmPin('');
              }, 500);
            }
          }
        }
      }
    }
  };

  const currentValue = mode === 'create' && step === 2 ? confirmPin : pin;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-[#060b13] border border-white/10 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            {mode === 'create' && step === 1 && (
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 shrink-0">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
              </div>
            )}
            {(mode === 'verify' || step === 2) && (
              <div className="w-16 h-16 bg-[#ff5c00]/20 rounded-full flex items-center justify-center mb-6 shrink-0">
                <Lock className="w-8 h-8 text-[#ff5c00]" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              {mode === 'verify' ? 'Controle Parental' : step === 1 ? 'Criar PIN de Acesso' : 'Confirmar PIN'}
            </h2>
            
            {mode === 'create' && step === 1 ? (
              <p className="text-gray-400 text-center mb-6 text-sm">
                O Diário e Análises contêm informações sensíveis sobre as crises e o histórico da criança. Crie uma senha de 4 dígitos para manter essa área restrita e segura apenas para os pais ou responsáveis.
              </p>
            ) : mode === 'create' && step === 2 ? (
              <p className="text-gray-400 text-center mb-8">Digite novamente o PIN para confirmar.</p>
            ) : (
              <p className="text-gray-400 text-center mb-8">Digite o PIN para acessar esta área.</p>
            )}

            <div className="flex gap-4 mb-8">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold text-white transition-colors ${
                  error ? 'border-red-500 bg-red-500/10' :
                  currentValue[i] ? 'border-[#ff5c00] bg-[#ff5c00]/10' : 'border-white/10 bg-white/5'
                }`}>
                  {currentValue[i] ? '•' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                  key={num}
                  onClick={() => handleInput(currentValue + num)}
                  className="h-14 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xl transition-colors"
                >
                  {num}
                </button>
              ))}
              <div />
              <button 
                onClick={() => handleInput(currentValue + '0')}
                className="h-14 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xl transition-colors"
              >
                0
              </button>
              <button 
                onClick={() => {
                  if (mode === 'create' && step === 2) {
                    setConfirmPin(confirmPin.slice(0, -1));
                  } else {
                    setPin(pin.slice(0, -1));
                  }
                }}
                className="h-14 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xl transition-colors flex items-center justify-center"
              >
                ⌫
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
