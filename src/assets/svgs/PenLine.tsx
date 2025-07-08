import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const PenLine = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M9 20.25H4.5a.75.75 0 0 1-.75-.75v-4.19a.74.74 0 0 1 .216-.526l11.25-11.25a.75.75 0 0 1 1.068 0l4.182 4.182a.75.75 0 0 1 0 1.068L9 20.25Zm0 0h11.25M12.75 6 18 11.25"
      stroke="#101828"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(PenLine);
