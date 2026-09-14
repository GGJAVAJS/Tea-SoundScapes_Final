import React from 'react';

export function CarsFuelTank({ intensity, setIntensity, readOnly = false }: { intensity: number, setIntensity?: (val: number) => void, readOnly?: boolean }) {
  // intensity: 100 = Estressado, 0 = Calmo
  // fuelLevel: 0 = Vazio (Estressado), 100 = Cheio (Calmo)
  const fuelLevel = 100 - intensity;

  let fuelColor = '';
  let fuelText = '';
  let fuelGlow = '';
  let textColor = '';

  if (fuelLevel >= 80) {
    fuelColor = 'bg-[#10b981]'; // Verde brilhante
    fuelGlow = 'shadow-[0_0_20px_rgba(16,185,129,0.5)]';
    fuelText = 'Tanque Cheio - Felicidade / Calma';
    textColor = 'text-[#34d399]';
  } else if (fuelLevel >= 60) {
    fuelColor = 'bg-[#22c55e]'; // Verde
    fuelGlow = 'shadow-[0_0_20px_rgba(34,197,94,0.5)]';
    fuelText = 'Quase Cheio - Calma';
    textColor = 'text-[#4ade80]';
  } else if (fuelLevel >= 40) {
    fuelColor = 'bg-[#fbbf24]'; // Amarelo
    fuelGlow = 'shadow-[0_0_20px_rgba(251,191,36,0.5)]';
    fuelText = 'Meio Tanque - Neutro';
    textColor = 'text-[#fbbf24]';
  } else if (fuelLevel >= 20) {
    fuelColor = 'bg-[#f97316]'; // Laranja
    fuelGlow = 'shadow-[0_0_20px_rgba(249,115,22,0.5)]';
    fuelText = 'Na Reserva - Cansaço';
    textColor = 'text-[#fb923c]';
  } else {
    fuelColor = 'bg-[#ef4444]'; // Vermelho
    fuelGlow = 'shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    fuelText = 'Vazio - Estressado';
    textColor = 'text-[#f87171]';
  }

  return (
    <div className="flex flex-col items-center w-full px-2">
      <div className="w-full relative">
        <div className={`relative w-full ${readOnly ? 'h-8' : 'h-16'} bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border-2 border-[rgba(255,255,255,0.1)] overflow-hidden flex items-center p-1 shadow-inner`}>
          <div 
            className={`h-full rounded-xl transition-all duration-500 ease-out ${fuelColor} ${fuelGlow}`}
            style={{ width: `${Math.max(fuelLevel, 5)}%` }}
          >
            <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
          </div>
          
          <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none">
            <span className={`font-bold text-[#9ca3af]/80 ${readOnly ? 'text-sm' : 'text-xl'} font-mono`}>E</span>
            <div className="flex gap-4">
               <div className={`w-0.5 ${readOnly ? 'h-2' : 'h-4'} bg-[#6b7280]/50 rounded-full`} />
               <div className={`w-0.5 ${readOnly ? 'h-4' : 'h-6'} bg-[#6b7280]/50 rounded-full`} />
               <div className={`w-0.5 ${readOnly ? 'h-2' : 'h-4'} bg-[#6b7280]/50 rounded-full`} />
            </div>
            <span className={`font-bold text-[#9ca3af]/80 ${readOnly ? 'text-sm' : 'text-xl'} font-mono`}>F</span>
          </div>
        </div>

        {!readOnly && setIntensity && (
          <input 
            type="range"
            min="0"
            max="100"
            value={fuelLevel}
            onChange={(e) => setIntensity(100 - Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        )}
      </div>

      {!readOnly && (
        <div className="mt-6 text-center bg-[rgba(0,0,0,0.4)] px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.05)] backdrop-blur-sm">
          <span className={`text-sm md:text-base font-bold transition-colors duration-300 tracking-wide ${textColor}`}>
            {fuelText}
          </span>
        </div>
      )}
    </div>
  );
}
