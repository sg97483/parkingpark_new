import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const Location = (props: SvgProps) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M21.094 12.5a8.625 8.625 0 0 1-8.625 8.625m8.625-8.625a8.625 8.625 0 0 0-8.625-8.625m8.625 8.625h-3.75m-4.875 8.625A8.625 8.625 0 0 1 3.844 12.5m8.625 8.625v-3.75M3.844 12.5a8.625 8.625 0 0 1 8.625-8.625M3.844 12.5h3.75m4.875-8.625v3.75"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Location;
