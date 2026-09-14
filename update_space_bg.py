import re

with open('src/components/FloatingSpaceBackground.tsx', 'r') as f:
    content = f.read()

new_images = """
        {/* Rocekt */}
        <motion.img 
          src="/rocekt.png" 
          alt="Rocket" 
          className="absolute bottom-1/4 right-8 w-24 opacity-80 z-10"
          animate={{ 
            y: [0, -15, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
        />

        {/* Meteor */}
        <motion.img 
          src="/meteor.png" 
          alt="Meteor" 
          className="absolute top-1/4 left-1/4 w-16 opacity-70 z-10"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: 'transform' }}
        />

        {/* Planet 2 */}
        <motion.img 
          src="/planet2.png" 
          alt="Planet 2" 
          className="absolute top-12 right-1/4 w-20 opacity-60 z-0"
          animate={{ 
            y: [0, -10, 0],
            rotate: 360
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ willChange: 'transform' }}
        />

        {/* Planet */}
        <motion.img 
          src="/planet.png" 
          alt="Planet" 
          className="absolute bottom-12 left-8 w-32 opacity-70 z-0"
          animate={{ 
            rotate: 360
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ willChange: 'transform' }}
        />

        {/* Moon */}
        <motion.img 
          src="/moon.png" 
          alt="Moon" 
          className="absolute top-32 left-8 w-16 opacity-80 z-0"
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{ willChange: 'transform' }}
        />

        {/* Estrela Cadente (Shooting Star) */}
        <motion.img 
          src="/estrela_cadente.png" 
          alt="Shooting Star" 
          className="absolute top-0 right-0 w-32 opacity-60 z-0"
          animate={{ 
            x: ['100vw', '-100vw'],
            y: ['-50vh', '150vh'],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 3 }}
          style={{ willChange: 'transform' }}
        />
"""

# We'll just replace the entire content of the showImages block, while keeping satellite, asteroide, planet-big etc if desired, or replace them entirely. The user explicitly asked "where are the other icons..." which implies they are missing.
# Let's keep the existing ones and append the new ones.
start_idx = content.find("{/* Big Planet */}")
if start_idx != -1:
    content = content[:start_idx] + new_images + content[start_idx:]
    with open('src/components/FloatingSpaceBackground.tsx', 'w') as f:
        f.write(content)
    print("Added new images!")
else:
    print("Could not find Big Planet")

