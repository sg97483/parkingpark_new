import React from 'react';
import {Svg} from 'react-native-svg';
import {Path} from 'react-native-svg';
import {SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const Search = (props: SvgProps) => {
  return (
    <Svg
      width={widthScale(20)}
      height={widthScale(20)}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M14.4438 14.4438L19.0001 19.0001M16.75 8.875C16.75 13.2242 13.2242 16.75 8.875 16.75C4.52576 16.75 1 13.2242 1 8.875C1 4.52576 4.52576 1 8.875 1C13.2242 1 16.75 4.52576 16.75 8.875Z"
        stroke="#242424"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Search;
