import { useCallback, useState } from "react";

export function useAlert() {
  const [alert, setAlert] = useState(null);

  // Works with Error objects as the `message` argument
  const setError = useCallback(
    (message) => setAlert({ type: "error", message: message.message ?? message }),
    [],
  );
  const setWarning = useCallback((message) => setAlert({ type: "warning", message }), []);
  const setInfo = useCallback((message) => setAlert({ type: "info", message }), []);
  const setSuccess = useCallback((message) => setAlert({ type: "success", message }), []);
  const resetAlert = useCallback(() => setAlert(null), []);

  return { alert, setError, setWarning, setInfo, setSuccess, resetAlert };
}
