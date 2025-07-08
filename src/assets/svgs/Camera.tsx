import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
interface CameraProps extends SvgProps {
  customWidth?: number;
  customHeight?: number;
}

const Camera = (props: CameraProps) => (
  <Svg width={25} height={25} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M19.75 20.3867H4.75C4.35218 20.3867 3.97064 20.2287 3.68934 19.9474C3.40804 19.6661 3.25 19.2845 3.25 18.8867V8.38672C3.25 7.98889 3.40804 7.60736 3.68934 7.32606C3.97064 7.04475 4.35218 6.88672 4.75 6.88672H7.75L9.25 4.63672H15.25L16.75 6.88672H19.75C20.1478 6.88672 20.5294 7.04475 20.8107 7.32606C21.092 7.60736 21.25 7.98889 21.25 8.38672V18.8867C21.25 19.2845 21.092 19.6661 20.8107 19.9474C20.5294 20.2287 20.1478 20.3867 19.75 20.3867Z"
      stroke={props.stroke || '#242424'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.25 16.6367C14.114 16.6367 15.625 15.1257 15.625 13.2617C15.625 11.3978 14.114 9.88672 12.25 9.88672C10.386 9.88672 8.875 11.3978 8.875 13.2617C8.875 15.1257 10.386 16.6367 12.25 16.6367Z"
      stroke={props.stroke || '#242424'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Camera);
