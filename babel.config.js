const moduleResolver = [
  require.resolve('babel-plugin-module-resolver'),
  {
    root: ['./src/'],
    alias: {
      '~images': './src/assets/images',
      '~icons': './src/assets/icons',
      '~fonts': './src/assets/fonts',
      '~components': './src/components',
      '~constants': './src/constants',
      '~hooks': './src/hooks',
      '~navigators': './src/navigators',
      '~screens': './src/screens',
      '~services': './src/services',
      '~reducers': './src/stores/reducers',
      '~store': './src/stores/store',
      '~styles': './src/styles',
      '~utils': './src/utils',
      '~schemas': './src/schemas',
      '~': './src',
    },
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.android.js',
      '.android.jsx',
      '.android.ts',
      '.android.tsx',
      '.ios.js',
      '.ios.jsx',
      '.ios.ts',
      '.ios.tsx',
      '.native.js',
      '.native.jsx',
      '.native.ts',
      '.native.tsx',
    ],
  },
];

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    moduleResolver,
    'react-native-paper/babel',
    'react-native-reanimated/plugin',
    // (private-methods 플러그인은 override에서 제어)
  ],
  overrides: [
    // 👇 realm 코드에는 private-methods 플러그인 **적용 안함**
    {
      test: /node_modules[\\/]realm/,
      plugins: [],
    },
    // 👇 나머지 코드에는 private-methods 플러그인 **적용**
    {
      exclude: /node_modules[\\/]realm/,
      plugins: [['@babel/plugin-transform-private-methods', {loose: true}]],
    },
  ],
};
