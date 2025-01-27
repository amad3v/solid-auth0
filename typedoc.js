/** @type {Partial<import("typedoc").TypeDocOptions>} */

const config = {
  name: 'solid-auth0',
  out: './docs/',
  exclude: ['./src/utils.ts', './src/wrappers.ts', './src/env.d.ts'],
  excludeExternals: false,
  excludePrivate: true,
  hideGenerator: true,
  readme: './README.md',
  visibilityFilters: {
    protected: false,
    inherited: true,
    external: true,
  },
};

export default config;
