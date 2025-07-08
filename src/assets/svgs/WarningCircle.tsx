import React, {memo} from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const WarningCircle = memo((props: SvgProps) => {
  return (
    <Svg
      width={16}
      height={17}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8 5.496v3.5m.25 2.25a.25.25 0 1 1-.407-.195m.407.195a.25.25 0 0 0-.25-.25m.25.25-.25-.25m.25.25H8l-.157-.195M8 10.996c-.06 0-.114.02-.157.055M14 8.496a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
        stroke="#DF1D1D"
        strokeLinecap="round"
      />
    </Svg>
  );
});

export default WarningCircle;
