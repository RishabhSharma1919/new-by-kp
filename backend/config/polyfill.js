import buffer from "node:buffer";
import { createRequire } from "node:module";

// Polyfill for SlowBuffer which was removed in Node.js 22+
// Required by buffer-equal-constant-time (dep of jwa/jsonwebtoken)
try {
  const require = createRequire(import.meta.url);
  const cjsBuffer = require("buffer");
  if (!cjsBuffer.SlowBuffer) {
    cjsBuffer.SlowBuffer = cjsBuffer.Buffer;
  }
} catch (_) {}

if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
if (typeof globalThis.SlowBuffer === "undefined") {
  globalThis.SlowBuffer = buffer.Buffer;
}
