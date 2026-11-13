const fs = require('fs');
const path = require('path');

const targetPaths = [
  path.join(__dirname, 'node_modules', 'buffer-equal-constant-time', 'index.js'),
  path.join(__dirname, 'backend', 'node_modules', 'buffer-equal-constant-time', 'index.js'),
  path.join(__dirname, '..', 'node_modules', 'buffer-equal-constant-time', 'index.js'),
];

targetPaths.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('SlowBuffer.prototype.equal')) {
        content = content.replace(
          'var origSlowBufEqual = SlowBuffer.prototype.equal;',
          'var origSlowBufEqual = (typeof SlowBuffer !== "undefined" && SlowBuffer && SlowBuffer.prototype) ? SlowBuffer.prototype.equal : null;'
        );
        content = content.replace(
          'Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that)',
          'Buffer.prototype.equal = function equal(that)'
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[Patch] Successfully patched: ${filePath}`);
      }
    } catch (err) {
      console.warn(`[Patch] Could not patch ${filePath}:`, err.message);
    }
  }
});
