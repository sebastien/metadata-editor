export function assert(condition) {
  if (!condition) {
    console.error.apply(console, ["Assertion failed:"].concat(arguments));
  }
}

export function error() {
  console.error.apply(console, ["Error:"].concat(arguments));
}
