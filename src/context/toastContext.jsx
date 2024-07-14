import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((toast) => {
    // TODO timestamps are not really safe, adding two toasts within 1ms will cause errors
    toast.timestamp = Date.now();
    setToasts((prev) => [...prev, toast]);
  }, []);

  const pushErrorToast = useCallback((error) => {
    pushToast({ title: error.message, error: true });
  }, []);

  const removeToast = useCallback((toast) => {
    setToasts((prev) => prev.filter((t) => t.timestamp !== toast.timestamp));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, pushToast, pushErrorToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
