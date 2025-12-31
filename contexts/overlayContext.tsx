import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export type Variant = "neutral" | "info" | "success" | "warning" | "error";

export type AlertOptions = {
  title?: string;
  message?: string;
  variant?: Variant;
};

export type ConfirmOptions = {
  title?: string;
  message?: string;
  okText?: string;
  cancelText?: string;
  variant?: Variant;
};

export type ToastOptions = {
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  variant?: Variant;
};

export type ModalOptions = {
  content: React.ReactNode;
  dismissible?: boolean;
};

export type OverlayContextValue = {
  alert: (opts: AlertOptions) => void;
  dismissAlert: () => void;

  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  destructiveConfirm: (opts: ConfirmOptions) => Promise<boolean>;
  dismissConfirm: () => void;

  toast: (opts: ToastOptions | string) => void;

  modal: (opts: ModalOptions) => void;
  dismissModal: () => void;
};

export const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({
  children,
  AlertUI,
  ConfirmUI,
  ToastUI,
  ModalUI,
}: {
  children: React.ReactNode;
  AlertUI: React.FC<{
    visible: boolean;
    state: AlertOptions | null;
    onDismiss: () => void;
  }>;
  ConfirmUI: React.FC<{
    visible: boolean;
    state: ConfirmOptions | null;
    onOk: () => void;
    onCancel: () => void;
  }>;
  ToastUI: React.FC<{
    visible: boolean;
    state: ToastOptions;
    onDismiss: () => void;
  }>;
  ModalUI: React.FC<{
    visible: boolean;
    state: ModalOptions | null;
    onDismiss: () => void;
  }>;
}) {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertState, setAlertState] = useState<AlertOptions | null>(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);
  const confirmResolver = useRef<((v: boolean) => void) | null>(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastState, setToastState] = useState<ToastOptions>({
    message: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalState, setModalState] = useState<ModalOptions | null>(null);

  const alert = useCallback((opts: AlertOptions) => {
    setAlertState({
      title: opts.title ?? "Notice",
      message: opts.message ?? "",
      variant: opts.variant,
    });
    setAlertVisible(true);
  }, []);

  const dismissAlert = useCallback(() => {
    setAlertVisible(false);
    setAlertState(null);
  }, []);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve;
      setConfirmState({
        title: opts.title ?? "Are you sure?",
        message: opts.message ?? "",
        okText: opts.okText ?? "OK",
        cancelText: opts.cancelText ?? "Cancel",
        variant: opts.variant ?? "neutral",
      });
      setConfirmVisible(true);
    });
  }, []);

  const destructiveConfirm = useCallback(
    (opts: ConfirmOptions) =>
      confirm({
        ...opts,
        variant: opts.variant ?? "error",
        okText: opts.okText ?? "Delete",
      }),
    [confirm]
  );

  const dismissConfirm = useCallback(() => {
    setConfirmVisible(false);
    setConfirmState(null);
  }, []);

  const onConfirmOk = useCallback(() => {
    setConfirmVisible(false);
    const resolve = confirmResolver.current;
    confirmResolver.current = null;
    setConfirmState(null);
    resolve?.(true);
  }, []);

  const onConfirmCancel = useCallback(() => {
    setConfirmVisible(false);
    const resolve = confirmResolver.current;
    confirmResolver.current = null;
    setConfirmState(null);
    resolve?.(false);
  }, []);

  const toast = useCallback((opts: ToastOptions | string) => {
    const next = typeof opts === "string" ? { message: opts } : opts;
    setToastState({
      message: next.message,
      duration: next.duration ?? 2500,
      actionLabel: next.actionLabel,
      onAction: next.onAction,
      variant: next.variant,
    });
    setToastVisible(true);
  }, []);

  const modal = useCallback((opts: ModalOptions) => {
    setModalState(opts);
    setModalVisible(true);
  }, []);

  const dismissModal = useCallback(() => {
    setModalVisible(false);
    setModalState(null);
  }, []);

  const value = useMemo<OverlayContextValue>(
    () => ({
      alert,
      dismissAlert,
      confirm,
      destructiveConfirm,
      dismissConfirm,
      toast,
      modal,
      dismissModal,
    }),
    [
      alert,
      dismissAlert,
      confirm,
      destructiveConfirm,
      dismissConfirm,
      toast,
      modal,
      dismissModal,
    ]
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}

      <AlertUI
        visible={alertVisible}
        state={alertState}
        onDismiss={dismissAlert}
      />
      <ConfirmUI
        visible={confirmVisible}
        state={confirmState}
        onOk={onConfirmOk}
        onCancel={onConfirmCancel}
      />
      <ToastUI
        visible={toastVisible}
        state={toastState}
        onDismiss={() => setToastVisible(false)}
      />
      <ModalUI
        visible={modalVisible}
        state={modalState}
        onDismiss={dismissModal}
      />
    </OverlayContext.Provider>
  );
}

export function useOverlay(): OverlayContextValue {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error("useOverlay must be used within OverlayProvider");
  }
  return ctx;
}
