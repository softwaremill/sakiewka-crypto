module.exports = {
  out: './docs',
  exclude: [
    '**/tests/**/*',
    '**/bitcoin.ts',
    '**/ethereum.ts',
    '**/index.ts',
    '**/notes.ts',
    '**/backend-api.ts',
    '**/utils/**/*',
  ],

  mode: 'modules',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true
}