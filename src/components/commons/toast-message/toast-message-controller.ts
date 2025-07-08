import {MutableRefObject} from 'react';
import {ToastMessageRefs} from './toast-message';

export default class ToastMessageController {
  static toastMessageRef: MutableRefObject<ToastMessageRefs>;

  static setToastMessageRef = (ref: any) => {
    this.toastMessageRef = ref;
  };

  static show = (message: string) => {
    this.toastMessageRef?.current?.show(message);
  };
}
