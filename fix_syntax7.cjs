const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const target = `    </motion.div>
  );
}`;

const repl = `    </motion.div>
    </>
  );
}`;
code = code.replace(target, repl);

fs.writeFileSync('src/views/DiaryView.tsx', code);
