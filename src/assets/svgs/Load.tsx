import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const Load = (props: SvgProps) => (
  <Svg
    width={widthScale(24)}
    height={widthScale(24)}
    viewBox="0 0 24 24"
    fill="none"
    // xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M16.5188 9.34686H21.0188M21.0188 9.34686V4.84686M21.0188 9.34686L17.8311 6.16875C16.6776 5.0143 15.2076 4.22789 13.6071 3.90902C12.0066 3.59014 10.3474 3.75313 8.83953 4.37735C7.33165 5.00158 6.04278 6.059 5.13596 7.41585C4.22914 8.7727 3.74512 10.368 3.74512 12C3.74512 13.632 4.22914 15.2273 5.13596 16.5842C6.04278 17.941 7.33165 18.9984 8.83953 19.6227C10.3474 20.2469 12.0066 20.4099 13.6071 20.091C15.2076 19.7721 16.6776 18.9857 17.8311 17.8313"
      stroke="#6F6F6F"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(Load);
