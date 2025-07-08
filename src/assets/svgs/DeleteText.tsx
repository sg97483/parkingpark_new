import * as React from 'react';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';

const DeleteText = (props: SvgProps) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
    <Rect width={14} height={14} rx={7} fill="#DFDFDF" />
    <Path
      d="M9.8125 4.1875L4.1875 9.8125M9.8125 9.8125L4.1875 4.1875"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(DeleteText);
