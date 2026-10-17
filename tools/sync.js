// Copies the shared scripts into each self-contained site folder.
// Edit shared/js/*, then run from the project root: node tools/sync.js
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const DIRS = ['site-a-citarasa-istana', 'site-b-ingat-rendang'];
const SHARED_FILES = ['data.js', 'core.js',
  'vendor/gsap.min.js', 'vendor/ScrollTrigger.min.js', 'vendor/SplitText.min.js', 'vendor/lenis.min.js'];

function sync() {
  const done = [];
  for (const dir of DIRS) {
    for (const rel of SHARED_FILES) {
      const from = path.join(ROOT, 'shared', 'js', rel);
      if (!fs.existsSync(from)) continue;
      const to = path.join(ROOT, dir, 'assets', 'js', rel);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
      done.push(path.relative(ROOT, to));
    }
  }
  return done;
}

module.exports = { DIRS, SHARED_FILES, sync };
if (require.main === module) console.log(sync().join('\n'));
