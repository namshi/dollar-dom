import babel from 'rollup-plugin-babel';
import babili from 'rollup-plugin-babili';

export default {
  entry: './index.js',
  dest: './build/dollar-dom.min.js',
  format: 'umd',
  moduleName: 'dollarDom',
  sourceMap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    babili()
  ]
};