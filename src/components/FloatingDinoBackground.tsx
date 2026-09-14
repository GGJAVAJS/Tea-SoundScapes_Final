import React from 'react';
import { motion } from 'motion/react';

export const FloatingDinoBackground = React.memo(({ showImages = true }: { showImages?: boolean }) => {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
      style={{ 
        width: '100vw', 
        height: '100vh',
        background: 'linear-gradient(to bottom, rgba(137, 92, 7, 0.5), rgba(42, 72, 6, 1))'
      }}
    >
      {showImages && (
        <div className="absolute inset-0 w-full max-w-md mx-auto">
        {/* Clouds */}
        <motion.img src="/themes/dinossauro/cloud.png" alt="" className="absolute -top-4 -left-4 w-32 opacity-90" animate={{ y: [0, -5, 0], x: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
        <motion.img src="/themes/dinossauro/cloud.png" alt="" className="absolute -top-2 left-[20%] w-32 opacity-90" animate={{ y: [0, -8, 0], x: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: 'transform' }} />
        <motion.img src="/themes/dinossauro/cloud.png" alt="" className="absolute top-0 left-[40%] w-32 opacity-90" animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ willChange: 'transform' }} />
        <motion.img src="/themes/dinossauro/cloud.png" alt="" className="absolute -top-2 right-[15%] w-32 opacity-90" animate={{ y: [0, -7, 0], x: [0, 4, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} style={{ willChange: 'transform' }} />
        <motion.img src="/themes/dinossauro/cloud.png" alt="" className="absolute -top-4 -right-4 w-32 opacity-90" animate={{ y: [0, -5, 0], x: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} style={{ willChange: 'transform' }} />

        {/* Fossils */}
        <motion.img src="/themes/dinossauro/fossil.png" alt="" className="absolute top-24 left-4 w-24 opacity-90" animate={{ y: [0, -10, 0], rotate: [-20, -15, -20] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
        <motion.img src="/themes/dinossauro/fossil_rex.png" alt="" className="absolute top-[35%] right-2 w-28 opacity-90" animate={{ y: [0, -15, 0], rotate: [10, 15, 10] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: 'transform' }} />

        {/* Characters */}
        <motion.img src="/themes/dinossauro/dino_fofo.png" alt="" className="absolute bottom-24 left-[-10px] w-32 z-10" animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
        <motion.img src="/themes/dinossauro/dino_alto.png" alt="" className="absolute bottom-16 left-[20%] w-64 z-0" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} style={{ willChange: 'transform' }} />
        <motion.img src="/themes/dinossauro/fantasia_dino.png" alt="" className="absolute bottom-28 right-[-10px] w-32 z-10" animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: 'transform' }} />

        {/* Bottom Foliage */}
        <motion.img src="/themes/dinossauro/arvore.png" alt="" className="absolute bottom-[-10px] left-[-30px] w-56 opacity-100 z-20" animate={{ rotate: [0, 2, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform', transformOrigin: 'bottom center' }} />
        <motion.img src="/themes/dinossauro/palmeiras.png" alt="" className="absolute bottom-[-10px] right-[-40px] w-64 opacity-100 z-20 scale-x-[-1]" animate={{ rotate: [0, -2, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform', transformOrigin: 'bottom center' }} />
        <motion.img src="/themes/dinossauro/floresta.png" alt="" className="absolute bottom-[20px] left-[50%] -translate-x-[50%] w-72 opacity-95 z-0" animate={{ y: [0, 5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
        <motion.img src="/themes/dinossauro/palmeiras.png" alt="" className="absolute bottom-12 right-16 w-24 z-30" animate={{ rotate: [2, -2, 2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ willChange: 'transform', transformOrigin: 'bottom center' }} />
      </div>
      )}
    </div>
  );
});
