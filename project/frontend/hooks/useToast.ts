import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useMemo } from "react";

type ToastPromiseParams = {
  pending?: string;
  success?: string;
  error?: string;
  errorKeys?: { [x in string]: string };
};

export const useToastPromise = (options?: UseToastOptions) => {
  const toast = useToast(options);
  const handlePromise = (
    promise: Promise<T>,
    params: ToastPromiseParams = {}
  ) => {
    const {
      pending = "Trwa zapisywanie",
      success = "Pomyślnie zapisano",
      error = "błąd",
    } = params;
    const toastId = toast({
      status: "info",
      description: pending,
      duration: null,
    });

    const errorKeys = {
      ...params.errorKeys,
      ServerError: "errorKeys.serverError",
      WrongRole: "errorKeys.wrongRole",
    };

    return promise
      .then((result) => {
        toast.update(toastId, {
          status: "success",
          description: success,
          duration: 5000,
        });
        return result;
      })
      .catch((result) => {
        toast.update(toastId, {
          status: "error",
          description: error,
          duration: 5000,
        });
        return result;
      });
  };

  return useMemo(() => ({ promise: handlePromise }), []);
};
