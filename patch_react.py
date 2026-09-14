import re

with open('src/views/ProfileView.tsx', 'r') as f:
    content = f.read()

content = content.replace("import React, { useState, useRef } from 'react';", "import React, { useState, useRef, useEffect } from 'react';")

with open('src/views/ProfileView.tsx', 'w') as f:
    f.write(content)
