const fs = require('fs');
const path = require('path');

function stripCommentsJsTs(content) {
  // 1. Remove JSX comments of the form {/* ... */}
  let result = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
  
  // 2. Character-by-character state machine to remove JSDoc, multi-line, and single-line comments
  let output = [];
  let i = 0;
  const n = result.length;
  let state = "normal";
  let inString = null;
  let escape = false;
  
  while (i < n) {
    const char = result[i];
    
    if (state === "normal") {
      if (i + 1 < n && result.slice(i, i + 2) === "//") {
        state = "single_line_comment";
        i += 2;
        continue;
      } else if (i + 1 < n && result.slice(i, i + 2) === "/*") {
        state = "multi_line_comment";
        i += 2;
        continue;
      } else if (char === '"' || char === "'" || char === "`") {
        state = "string";
        inString = char;
        escape = false;
        output.push(char);
      } else {
        output.push(char);
      }
    } else if (state === "string") {
      output.push(char);
      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === inString) {
        state = "normal";
        inString = null;
      }
    } else if (state === "single_line_comment") {
      if (char === "\n") {
        state = "normal";
        output.push("\n");
      }
    } else if (state === "multi_line_comment") {
      if (i + 1 < n && result.slice(i, i + 2) === "*/") {
        state = "normal";
        i += 2;
        continue;
      }
    }
    i++;
  }
  
  let finalResult = output.join('');
  
  // Remove empty curly braces {} that might be left in JSX after stripping comments
  finalResult = finalResult.replace(/\{\s*\}/g, '');
  
  return finalResult;
}

function stripCommentsCss(content) {
  let output = [];
  let i = 0;
  const n = content.length;
  let state = "normal";
  let inString = null;
  let escape = false;
  
  while (i < n) {
    const char = content[i];
    
    if (state === "normal") {
      if (i + 1 < n && content.slice(i, i + 2) === "/*") {
        state = "multi_line_comment";
        i += 2;
        continue;
      } else if (char === '"' || char === "'") {
        state = "string";
        inString = char;
        escape = false;
        output.push(char);
      } else {
        output.push(char);
      }
    } else if (state === "string") {
      output.push(char);
      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === inString) {
        state = "normal";
        inString = null;
      }
    } else if (state === "multi_line_comment") {
      if (i + 1 < n && content.slice(i, i + 2) === "*/") {
        state = "normal";
        i += 2;
        continue;
      }
    }
    i++;
  }
  
  return output.join('');
}

function processFile(filepath) {
  console.log(`Processing: ${filepath}`);
  const content = fs.readFileSync(filepath, 'utf8');
  const ext = path.extname(filepath);
  
  let newContent;
  if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    newContent = stripCommentsJsTs(content);
  } else if (ext === '.css') {
    newContent = stripCommentsCss(content);
  } else {
    return;
  }
  
  fs.writeFileSync(filepath, newContent, 'utf8');
  console.log(`Finished: ${filepath}`);
}

function walkAndStrip(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkAndStrip(fullPath);
    } else {
      const ext = path.extname(fullPath);
      if (['.ts', '.tsx', '.js', '.jsx', '.css'].includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

// Strip comments in app/ and lib/
console.log("Starting comment stripping...");
walkAndStrip('app');
walkAndStrip('lib');
console.log("All comments stripped successfully!");
