const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'), 'mp4'],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg', 'cjs'],
    extraNodeModules: {
      '~images': `${__dirname}/src/assets/images`,
      '~icons': `${__dirname}/src/assets/icons`,
      '~fonts': `${__dirname}/src/assets/fonts`,
      '~components': `${__dirname}/src/components`,
      '~constants': `${__dirname}/src/constants`,
      '~hooks': `${__dirname}/src/hooks`,
      '~navigators': `${__dirname}/src/navigators`,
      '~screens': `${__dirname}/src/screens`,
      '~services': `${__dirname}/src/services`,
      '~reducers': `${__dirname}/src/stores/reducers`,
      '~store': `${__dirname}/src/stores/store`,
      '~styles': `${__dirname}/src/styles`,
      '~utils': `${__dirname}/src/utils`,
      '~schemas': `${__dirname}/src/schemas`,
      '~': `${__dirname}/src`,
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
});
