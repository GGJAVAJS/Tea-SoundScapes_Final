const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const target1 = `    </motion.div>
    </>
  );
}`;

const repl1 = `    </motion.div>
  );
}`;
code = code.replace(target1, repl1);

fs.writeFileSync('src/views/DiaryView.tsx', code);
