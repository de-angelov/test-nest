const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

module.exports = {
  output: {
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/index.ts',
      tsConfig: './tsconfig.lib.json',
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      outputFileName: 'index.ts',
    }),
  ],
};
