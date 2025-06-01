// storybook-private-apis.js
//
// Whenever Gutenberg tries to opt into private APIs, hand back a no-op for
// any method (lock, unlock, registerPrivateSelectors, etc.).
export function __dangerousOptInToUnstableAPIsOnlyForCoreModules() {
  return new Proxy(
    {},
    {
      get(target, prop) {
        // If someone does `const { registerPrivateSelectors } = …`, this returns a no-op
        return () => {};
      },
    }
  );
}
