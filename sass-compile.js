/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import sass from 'sass';
import fs from 'fs';
import path from 'path';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ignoredFiles = []; // Add files to explicitly ignore if needed

const compileAndSave = async (sassFile) => {
  const dest = sassFile.replace(path.extname(sassFile), '.css');

  try {
    const result = await sass.compileAsync(sassFile, { style: 'compress' });
    await fs.promises.writeFile(dest, result.css);
    console.log(`Compiled: ${sassFile} → ${dest}`);
  } catch (error) {
    console.error(`Error compiling ${sassFile}:`, error);
  }
};

const processFiles = async (parent) => {
  let files = await readdir(parent, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      await processFiles(path.join(parent, file.name)); // Recursively process folders
    } else if (path.extname(file.name) === '.scss' && !file.name.startsWith('_')) {
      // Ignore partials (_name.scss)
      if (!ignoredFiles.includes(file.name)) {
        await compileAndSave(path.join(parent, file.name));
      } else {
        console.log(`Ignored: ${file.name}`);
      }
    }
  }
};

// Run initial compilation process
for (const folder of ['styles', 'blocks']) {
  try {
    await processFiles(path.join(__dirname, folder));
  } catch (err) {
    console.error(`Error processing folder: ${folder}`, err);
  }
}

// Watch for changes in SCSS files
fs.watch('.', { recursive: true }, (eventType, fileName) => {
  if (fileName && path.extname(fileName) === '.scss' && eventType === 'change' && !path.basename(fileName).startsWith('_')) {
    // Ignore partials (_name.scss)
    console.log(`Change detected: ${fileName}`);
    if (!ignoredFiles.includes(fileName)) {
      compileAndSave(path.join(__dirname, fileName));
    } else {
      console.log(`Ignored: ${fileName}`);
    }
  }
});
