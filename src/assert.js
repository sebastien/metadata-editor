export default function assert(value, message) {
  if (!value) {
    console.error("Assertion failed", message);
  }
}
