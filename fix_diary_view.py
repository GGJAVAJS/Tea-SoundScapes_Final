import re

with open('src/views/DiaryView.tsx', 'r') as f:
    content = f.read()

# Replace dinosaur-humor-container with responsive classes
content = content.replace("'dinosaur-humor-container'", "'w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center'")
# Replace dinosaur-humor-image with responsive classes
content = content.replace("'dinosaur-humor-image'", "'w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-md shrink-0'")

with open('src/views/DiaryView.tsx', 'w') as f:
    f.write(content)
