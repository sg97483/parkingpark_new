import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const StarFillBlack = (props: SvgProps) => (
  <Svg
    width={24}
    height={25}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="m12.413 18.378 4.725 3c.61.384 1.36-.187 1.181-.89l-1.369-5.382a.816.816 0 0 1 .272-.825l4.238-3.534c.553-.46.271-1.388-.45-1.434l-5.532-.357a.778.778 0 0 1-.684-.506l-2.063-5.194a.778.778 0 0 0-1.462 0L9.206 8.45a.778.778 0 0 1-.684.506l-5.531.357c-.722.046-1.003.974-.45 1.434l4.237 3.534a.815.815 0 0 1 .272.825l-1.265 4.988c-.216.843.684 1.528 1.406 1.069l4.397-2.785a.769.769 0 0 1 .825 0Z"
      fill="#333"
    />
  </Svg>
);

export default StarFillBlack;
