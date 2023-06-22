module.exports = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 160,
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.ts',
      options: {
        parser: 'typescript',
      },
    },
  ],
};
