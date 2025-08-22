// fix-imports.js
import fs from 'fs';
import path from 'path';

const dir = path.resolve('src'); // carpeta raíz del código fuente

function replaceImportInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Patrón para detectar importación problemática
  const pattern = /from ['"](\.{1,2}\/utils\/firebase)['"]/g;

  if (pattern.test(content)) {'../utils/firebase'

    const replaced = content.replace(pattern, "from ");
    fs.writeFileSync(filePath, replaced, 'utf8');
    console.log(`Modificado: ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      replaceImportInFile(fullPath);
    }
  }
}

walk(dir);
