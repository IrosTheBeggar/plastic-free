const fs = require('fs/promises');
const path = require('path');
const Markdoc = require('@markdoc/markdoc');
const mkdirp = require('mkdirp');

main()

async function main() {
  await recursiveScan(path.join(__dirname, 'markdown'));
}

async function recursiveScan(directory) {
  for (const file of await fs.readdir(directory)) {
    try {
      var stat = await fs.stat(path.join(directory, file));
    } catch (e) { continue; } /* Bad file or permission error, ignore and continue */
  
    if (stat.isDirectory()) {
      await recursiveScan(path.join(directory, file));
    } else {

      const ast = Markdoc.parse(await fs.readFile(path.join(directory, file), 'utf8'));
      const content = Markdoc.transform(ast, /* config */);
      const html = Markdoc.renderers.html(content);

      // lol
      mkdirp.sync(path.join(__dirname, 'build', path.relative(path.join(__dirname, 'markdown'), path.join(directory, file.split('.')[0]))));
      const newPath = path.join(__dirname, 'build', path.relative(path.join(__dirname, 'markdown'), path.join(directory, file.split('.')[0], 'index.html')));
      await fs.writeFile(newPath, html);
    }
  }
}