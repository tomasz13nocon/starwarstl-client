import { useCallback, useEffect, useRef, useState } from "react";
import { useAlert } from "./useAlert";
import { useToast } from "@/context/toastContext";

export function useFetch(
  fetchFunction,
  { onMount = false, onSuccess: onSuccessArg, successAlert, toastOnError = false } = {},
) {
  const [fetching, setFetching] = useState(onMount);
  const { alert, setError, setWarning, setInfo, setSuccess, resetAlert } = useAlert();
  const { pushErrorToast, pushToast } = useToast();

  // Returns a thenable - can be awaited.
  const fetcher = useCallback(
    (...args) => {
      resetAlert();
      setFetching(true);

      let onSuccess = onSuccessArg;

      fetchFunction(...args)
        .then((result) => {
          if (result?.info) setInfo(result.info);
          else if (result?.warning) setWarning(result.warning);
          else if (successAlert) setSuccess(successAlert);

          // Due to how the event loop works, if then() returned by the fetcher function
          // gets called before the call stack gets emptied it should always run
          // before this promise starts fulfilling, so onSuccess will be set by the time this runs
          if (onSuccess) onSuccess(result);
        })
        .catch((e) => {
          if (toastOnError) pushErrorToast(e);
          else setError(e);
        })
        .finally(() => setFetching(false));

      return {
        thenToast: (toast) => {
          pushToast(toast);
          return this;
        },
        then: (handler) => (onSuccess = handler),
      };
    },
    [
      successAlert,
      toastOnError,
      pushErrorToast,
      setError,
      setWarning,
      setInfo,
      setSuccess,
      resetAlert,
    ],
  );

  // TODO probably remove for prod, this is only needed for strict mode
  const onMountRan = useRef(false);
  useEffect(() => {
    if (onMount && !onMountRan.current) {
      onMountRan.current = true;
      fetcher();
    }
  }, []);

  return [fetcher, fetching, alert, resetAlert];
}
