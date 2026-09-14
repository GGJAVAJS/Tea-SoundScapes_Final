import fs from 'fs';

let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf-8');

const targetMood = `<div className="flex justify-between items-center px-2">
          {MOODS.map(mood => (`;

const newMood = `{isCarsTheme ? (
          <CarsFuelTank intensity={intensity} setIntensity={setIntensity} />
        ) : (
          <div className="flex justify-between items-center px-2">
            {MOODS.map(mood => (`;

code = code.replace(targetMood, newMood);

const targetMoodEnd = `</button>
          ))}
        </div>
      </div>`;

const newMoodEnd = `</button>
            ))}
          </div>
        )}
      </div>`;

code = code.replace(targetMoodEnd, newMoodEnd);

const targetSlider = `{/* Intensity Slider */}
      <div className="mt-4">
        <input`;

const newSlider = `{/* Intensity Slider */}
      {!isCarsTheme && (
      <div className="mt-4">
        <input`;

code = code.replace(targetSlider, newSlider);

const targetSliderEnd = `onClick={() => setIntensity(100)}>Estressado</span>
        </div>
      </div>`;

const newSliderEnd = `onClick={() => setIntensity(100)}>Estressado</span>
        </div>
      </div>
      )}`;

code = code.replace(targetSliderEnd, newSliderEnd);


const carsFuelTankCode = `
function CarsFuelTank({ intensity, setIntensity }: { intensity: number, setIntensity: (val: number) => void }) {
  const fuelLevel = 100 - intensity;

  let fuelColor = '';
  let fuelText = '';
  let fuelGlow = '';
  let textColor = '';

  if (fuelLevel >= 70) {
    fuelColor = 'bg-emerald-500';
    fuelGlow = 'shadow-[0_0_20px_rgba(16,185,129,0.5)]';
    fuelText = 'Tanque Cheio - Pronto para rodar!';
    textColor = 'text-emerald-400';
  } else if (fuelLevel >= 30) {
    fuelColor = 'bg-amber-400';
    fuelGlow = 'shadow-[0_0_20px_rgba(251,191,36,0.5)]';
    fuelText = 'Meio Tanque - Ritmo tranquilo';
    textColor = 'text-amber-400';
  } else {
    fuelColor = 'bg-red-500';
    fuelGlow = 'shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    fuelText = 'Na Reserva - Hora de parar no box para descansar';
    textColor = 'text-red-400';
  }

  return (
    <div className="flex flex-col items-center w-full px-2">
      <div className="w-full relative">
        <div className="relative w-full h-16 bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border-2 border-white/10 overflow-hidden flex items-center p-1 shadow-inner">
          <div 
            className={\`h-full rounded-xl transition-all duration-500 ease-out \${fuelColor} \${fuelGlow}\`}
            style={{ width: \`\${Math.max(fuelLevel, 5)}%\` }}
          >
            <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
          </div>
          
          <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none">
            <span className="font-bold text-gray-400/80 text-xl font-mono">E</span>
            <div className="flex gap-4">
               <div className="w-0.5 h-4 bg-gray-500/50 rounded-full" />
               <div className="w-0.5 h-6 bg-gray-500/50 rounded-full" />
               <div className="w-0.5 h-4 bg-gray-500/50 rounded-full" />
            </div>
            <span className="font-bold text-gray-400/80 text-xl font-mono">F</span>
          </div>
        </div>

        <input 
          type="range"
          min="0"
          max="100"
          value={fuelLevel}
          onChange={(e) => setIntensity(100 - Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>

      <div className="mt-6 text-center bg-black/40 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
        <span className={\`text-sm md:text-base font-bold transition-colors duration-300 tracking-wide \${textColor}\`}>
          {fuelText}
        </span>
      </div>
    </div>
  );
}
`;

// Append CarsFuelTank at the end of the file
code = code + carsFuelTankCode;

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log("Success");
