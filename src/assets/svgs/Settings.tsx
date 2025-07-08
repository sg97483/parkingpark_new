import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Settings = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.222 6.104c.237.218.462.443.675.675l2.56.365c.416.724.738 1.5.955 2.306l-1.556 2.072s.028.638 0 .957l1.556 2.071a9.582 9.582 0 0 1-.956 2.307l-2.56.365s-.44.46-.674.675l-.366 2.56c-.724.417-1.5.738-2.306.956l-2.072-1.556a5.414 5.414 0 0 1-.956 0L9.45 21.413a9.58 9.58 0 0 1-2.306-.956l-.366-2.56a17.255 17.255 0 0 1-.675-.675l-2.56-.365a9.675 9.675 0 0 1-.956-2.307l1.557-2.072s-.028-.637 0-.956L2.587 9.45a9.581 9.581 0 0 1 .957-2.306l2.559-.365c.219-.232.444-.457.675-.675l.366-2.56a9.675 9.675 0 0 1 2.306-.956l2.072 1.556a5.45 5.45 0 0 1 .956 0l2.072-1.556a9.582 9.582 0 0 1 2.306.956l.366 2.56Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Settings);
