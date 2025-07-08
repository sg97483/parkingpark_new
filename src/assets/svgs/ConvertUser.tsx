import React from 'react';
import {Path, Svg, SvgProps} from 'react-native-svg';

const ConvertUser = (props: SvgProps) => {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8 9.999a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 0a4.5 4.5 0 0 0-4.012 2.462M8 10a4.5 4.5 0 0 1 4.013 2.462M12.5 8 14 9.5m0 0L15.5 8M14 9.5V8A6 6 0 0 0 2.956 4.742M.5 8 2 6.5m0 0L3.5 8M2 6.499v1.5a6 6 0 0 0 11.044 3.256"
        stroke="#6F6F6F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ConvertUser;
