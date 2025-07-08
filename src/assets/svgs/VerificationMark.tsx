import * as React from 'react';
import Svg, {Rect, Path, SvgProps} from 'react-native-svg';

const VerificationMark = (props: SvgProps) => (
  <Svg width={17} height={16} viewBox="0 0 17 16" fill="none" {...props}>
    <Rect x={0.5} width={16} height={16} rx={8} fill="#E5F4EB" />
    <Path
      d="M10.563 6.875 7.81 9.5 6.438 8.187m-1.383 3.258c-.432-.43-.146-1.336-.366-1.865-.22-.53-1.064-.994-1.064-1.58 0-.586.834-1.031 1.064-1.58.23-.548-.066-1.434.366-1.865.43-.432 1.336-.146 1.865-.366.53-.22.994-1.064 1.58-1.064.586 0 1.031.834 1.58 1.064.548.23 1.434-.066 1.865.366.432.43.146 1.336.366 1.865.22.53 1.064.994 1.064 1.58 0 .586-.834 1.031-1.064 1.58-.23.548.066 1.434-.366 1.865-.43.432-1.336.146-1.865.366-.53.22-.994 1.064-1.58 1.064-.586 0-1.031-.834-1.58-1.064-.548-.23-1.434.066-1.865-.366Z"
      stroke="#0AA765"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(VerificationMark);
