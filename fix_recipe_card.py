import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

# Add </motion.div> back to RecipeCard
bad_recipe = """      <div className="absolute right-4 top-4 z-20 opacity-80"> 
         {isThisPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
      </div>
      
        
  );
}"""

good_recipe = """      <div className="absolute right-4 top-4 z-20 opacity-80"> 
         {isThisPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
      </div>
    </motion.div>
  );
}"""

content = content.replace(bad_recipe, good_recipe)

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)
