const fs = require('fs');
const path = require('path');

const targetPaths = [
  path.join(__dirname, 'node_modules', 'buffer-equal-constant-time', 'index.js'),
  path.join(__dirname, 'backend', 'node_modules', 'buffer-equal-constant-time', 'index.js'),
  path.join(__dirname, '..', 'node_modules', 'buffer-equal-constant-time', 'index.js'),
  path.join(process.cwd(), 'node_modules', 'buffer-equal-constant-time', 'index.js'),
  path.join(process.cwd(), 'backend', 'node_modules', 'buffer-equal-constant-time', 'index.js'),
];

let patchedCount = 0;

targetPaths.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');

      if (content.includes("typeof SlowBuffer !== 'undefined'") || content.includes('typeof SlowBuffer !== "undefined"')) {
        return;
      }

      if (content.includes('SlowBuffer.prototype.equal')) {
        content = content.replace(
          'var origSlowBufEqual = SlowBuffer.prototype.equal;',
          'var origSlowBufEqual = (typeof SlowBuffer !== "undefined" && SlowBuffer && SlowBuffer.prototype) ? SlowBuffer.prototype.equal : null;'
        );
        content = content.replace(
          'Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {',
          'Buffer.prototype.equal = function equal(that) {\n    return bufferEq(this, that);\n  };\n  if (typeof SlowBuffer !== "undefined" && SlowBuffer && SlowBuffer.prototype) {\n    SlowBuffer.prototype.equal = Buffer.prototype.equal;\n  }\n};\n/* replaced */\nvar _dummy ='
        );
        content = content.replace(
          'SlowBuffer.prototype.equal = origSlowBufEqual;',
          'if (typeof SlowBuffer !== "undefined" && SlowBuffer && SlowBuffer.prototype) { SlowBuffer.prototype.equal = origSlowBufEqual; }'
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[Patch] Successfully patched: ${filePath}`);
        patchedCount++;
      }
    } catch (err) {
      console.warn(`[Patch] Could not patch ${filePath}:`, err.message);
    }
  }
});

console.log(`[Patch] Complete. Patched ${patchedCount} file(s).`);
