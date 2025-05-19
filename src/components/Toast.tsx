import {
  Button,
  QueuedToast,
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastRegion as ToastRegion,
} from "react-aria-components";
import { toastQueue } from "src/components/toastQueue";

// Define the type for your toast content.
export interface ToastType {
  type: "error";
  message: string;
}

export function Toasts() {
  return (
    <ToastRegion
      queue={toastQueue}
      className="fixed right-4 bottom-4 flex flex-col-reverse"
    >
      {({ toast }) => <ToastItem toast={toast} />}
    </ToastRegion>
  );
}

function ToastItem({ toast }: { toast: QueuedToast<ToastType> }) {
  return (
    <Toast
      toast={toast}
      style={{ viewTransitionName: toast.key }}
      className="flex items-center gap-2 rounded bg-red-600 px-4 py-2"
    >
      <Button
        slot="close"
        className="flex size-6 items-center justify-center rounded-lg bg-white/20"
      >
        x
      </Button>
      <ToastContent>
        {/* <Text slot="title">{toast.content.title}</Text> */}
        <Text slot="description">{toast.content.message}</Text>
      </ToastContent>
    </Toast>
  );
}
