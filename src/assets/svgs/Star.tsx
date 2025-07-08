import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Star = (props: SvgProps) => (
  <Svg width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="m12.913 17.878 4.725 3c.61.384 1.36-.187 1.181-.89l-1.369-5.382a.816.816 0 0 1 .272-.825l4.238-3.534c.553-.46.271-1.388-.45-1.434l-5.532-.357a.778.778 0 0 1-.684-.506l-2.063-5.194a.778.778 0 0 0-1.462 0L9.706 7.95a.778.778 0 0 1-.684.506l-5.531.357c-.722.046-1.003.975-.45 1.434l4.237 3.534a.815.815 0 0 1 .272.825l-1.265 4.988c-.216.843.684 1.528 1.406 1.069l4.397-2.785a.769.769 0 0 1 .825 0Z"
      stroke={props?.stroke || '#242424'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Star);
