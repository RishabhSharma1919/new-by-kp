import buffer from "node:buffer";

// Polyfill for SlowBuffer which was removed in newer Node.js runtimes
// Required by buffer-equal-constant-time (dep of jwa/jsonwebtoken)
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
if (typeof globalThis.SlowBuffer === "undefined") {
  globalThis.SlowBuffer = buffer.Buffer;
}

