import { ProgrammingLanguage } from '@shared/types';

export interface CodeTemplate {
  starterCode: string;
  defaultFilename: string;
}

export const LANGUAGE_FILE_NAMES: Record<ProgrammingLanguage, string> = {
  typescript: 'solution.ts',
  javascript: 'solution.js',
  python: 'solution.py',
  java: 'Solution.java',
  cpp: 'solution.cpp',
  c: 'solution.c',
  csharp: 'Solution.cs',
  php: 'solution.php',
  go: 'solution.go',
  rust: 'solution.rs',
};

export function getStarterCode(
  title: string,
  language: ProgrammingLanguage,
  tsCode?: string,
  javaCode?: string,
  solutions?: Record<string, string> | null,
): string {
  // If a custom solution exists in the solutions dictionary, return it
  if (solutions && solutions[language]) {
    return solutions[language];
  }

  // Use TypeScript if requested and available
  if (language === 'typescript' && tsCode) {
    return tsCode;
  }

  // Use Java if requested and available
  if (language === 'java' && javaCode) {
    return javaCode;
  }

  // Use JS by stripping TypeScript types if possible or fallback
  if (language === 'javascript') {
    if (tsCode) {
      // Lightly strip basic type annotations
      return tsCode
        .replace(/:\s*(string|number|boolean|any|void|number\[\]|string\[\]|Record<[^>]+>)/g, '')
        .replace(/<[A-Za-z0-9_,\s]+>/g, '');
    }
    return `// ${title}\nfunction solve(input) {\n  // Write your JavaScript solution here\n  \n}\n\nmodule.exports = { solve };\n`;
  }

  const funcName = title
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word, idx) => (idx === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join('');

  switch (language) {
    case 'python':
      return `"""\n${title}\n"""\n\nclass Solution:\n    def ${funcName}(self, *args):\n        # Write your Python 3 solution here\n        pass\n`;

    case 'cpp':
      return `// ${title}\n#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    void ${funcName}() {\n        // Write your C++ solution here\n    }\n};\n`;

    case 'c':
      return `// ${title}\n#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nvoid ${funcName}() {\n    // Write your C solution here\n}\n\nint main() {\n    return 0;\n}\n`;

    case 'csharp':
      return `// ${title}\nusing System;\nusing System.Collections.Generic;\n\npublic class Solution {\n    public void ${funcName.charAt(0).toUpperCase() + funcName.slice(1)}() {\n        // Write your C# solution here\n    }\n}\n`;

    case 'php':
      return `<?php\n// ${title}\n\nclass Solution {\n    /**\n     * @return mixed\n     */\n    function ${funcName}($input) {\n        // Write your PHP solution here\n    }\n}\n`;

    case 'go':
      return `// ${title}\npackage main\n\nimport "fmt"\n\nfunc ${funcName}() {\n    // Write your Go solution here\n}\n\nfunc main() {\n    fmt.Println("Running ${title}...")\n}\n`;

    case 'rust':
      return `// ${title}\nstruct Solution;\n\nimpl Solution {\n    pub fn ${funcName}() {\n        // Write your Rust solution here\n    }\n}\n\nfn main() {\n    println!("Solution initialized");\n}\n`;

    default:
      return `// Solution for ${title}\n`;
  }
}
