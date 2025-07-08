import {heightScale, heightScale1, widthScale, widthScale1} from './scaling-utils';

const scale = Math.min(widthScale(), heightScale());
const scale1 = Math.min(widthScale1(), heightScale1());

export const fontSize = (size: number) => size * scale;
export const fontSize1 = (size: number) => size * scale1;
