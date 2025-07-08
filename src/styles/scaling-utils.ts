import {Dimensions} from 'react-native';

const guidelineBaseWidth = 414;
const guidelineBaseHeight = 896;

const guidelineBaseWidth1 = 375;
const guidelineBaseHeight1 = 812;

const window = Dimensions.get('window');

const screen = Dimensions.get('screen');

const [shortDimension, longDimension] =
  window.width < window.height ? [window.width, window.height] : [window.height, window.width];

const [screenShortDimension, screenLongDimension] =
  screen.width < screen.height ? [screen.width, screen.height] : [screen.height, screen.width];

export const scale = (size = 1) => (shortDimension / guidelineBaseWidth) * size;

export const widthScale = (size = 1) => (shortDimension / guidelineBaseWidth) * size;

export const heightScale = (size = 1) => (longDimension / guidelineBaseHeight) * size;

export const scale1 = (size = 1) => (screenShortDimension / guidelineBaseWidth1) * size;

export const widthScale1 = (size = 1) => (screenShortDimension / guidelineBaseWidth1) * size;

export const heightScale1 = (size = 1) => (screenLongDimension / guidelineBaseHeight1) * size;
