import { UNSTABLE_ToastQueue as ToastQueue } from "react-aria-components";
import { flushSync } from "react-dom";
import { ToastType } from "src/components/Toast";

// Create a global ToastQueue.
export const toastQueue = new ToastQueue<ToastType>({
  // Wrap state updates in a CSS view transition.
  wrapUpdate(fn) {
    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        flushSync(fn);
      });
    } else {
      fn();
    }
  },
});
