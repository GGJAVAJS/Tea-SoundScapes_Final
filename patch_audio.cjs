const fs = require('fs');
let code = fs.readFileSync('src/lib/audioEngine.ts', 'utf8');

// I'll add 'delta_suaves' logic. We can do it inside fallbackToSynthetic, 
// at the bottom of the 'else if' chain.
// Looking at lines:
//         } else {
//           syntheticSourceNode.connect(gainNode);
//           targetVolume = 0.8;
//         }
//       }
//     }

const deltaCode = `      } else if (type === 'delta_suaves') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine'; osc2.type = 'sine';
        // Base freq and a slight delta for the "suaves" beat
        osc1.frequency.value = 110; 
        osc2.frequency.value = 113.5; 
        
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05; 
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.3; 
        
        const mixGain = ctx.createGain();
        mixGain.gain.value = 0.5; 
        
        lfo.connect(lfoGain);
        lfoGain.connect(mixGain.gain);
        osc1.connect(mixGain);
        osc2.connect(mixGain);
        mixGain.connect(gainNode);
        
        osc1.start();
        osc2.start();
        lfo.start();
        
        syntheticSourceNode = ctx.createBufferSource();
        syntheticSourceNode.buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        syntheticSourceNode.loop = true;
        syntheticSourceNode.connect(gainNode);
        
        targetVolume = 0.45; // user asked for volume 45, which we map to targetVolume scaling later
        extraSources.push(osc1, osc2, lfo, lfoGain, mixGain);
      } else {`;

code = code.replace(/      } else {\n          syntheticSourceNode\.connect\(gainNode\);\n          targetVolume = 0\.8;\n        }\n      }\n    }/, deltaCode + `
          syntheticSourceNode.connect(gainNode);
          targetVolume = 0.8;
        }
      }
    }`);

fs.writeFileSync('src/lib/audioEngine.ts', code);
