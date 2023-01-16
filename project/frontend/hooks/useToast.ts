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
      success = "Operacja zakończyła się sukcesem",
      error = "Wystąpił błąd",
    } = params;

    const toastId = toast({
      status: "info",
      description: pending,
      duration: null,
    });

    const errorKeys = {
      ...params.errorKeys,
      ServerError: "Wystąpił błąd z serwerem, spróbuj ponownie później",
      "Podany pracownik jest już zatrudniony.":"Podany pracownik jest już zatrudniony.",
      "Nie można usunąć pracownika, ponieważ jest on opiekunem zwierząt.":"Nie można usunąć pracownika, ponieważ jest on opiekunem zwierząt.",
      "Nie można usunąć zagrody, ponieważ znajdują się w niej zwierzęta.":"Nie można usunąć zagrody, ponieważ znajdują się w niej zwierzęta.",
      "Pracownik jest już przypisany do tej zagrody.":"Pracownik jest już przypisany do tej zagrody.",
      "Nie można usunąć klimatu, ponieważ przypisane są do niego zagrody.":"Nie można usunąć klimatu, ponieważ przypisane są do niego zagrody.",
      "Podana zagroda znajduje się już w bazie.":"Zagroda o tej nazwie znajduje się już w ZOO",
      'Klimat o podanej nazwie już istnieje.':'Klimat o podanej nazwie już istnieje.',
      "Podany pracownik jest już w tym zespole.":"Podany pracownik jest już w tym zespole.",
      "Jedzenie o podanej nazwie nie istnieje.":"Jedzenie o podanej nazwie nie istnieje.",
      "Podany gatunek znajduje się już w bazie.":"Podany gatunek znajduje się już w bazie.",
      'Zespół o podanej nazwie znajduje się już w bazie.':'Zespół o podanej nazwie znajduje się już w bazie.',
      "Nie można usunąć gatunku, ponieważ jest on przypisany do zwierząt.":"Nie można usunąć gatunku, ponieważ jest on przypisany do zwierząt.",
      "Podany gatunek jest już przypisany do tego klimatu.":"Podany gatunek jest już przypisany do tego klimatu.",
      "Klimat o podanej nazwie nie znajduje się w bazie.":"Klimat o podanej nazwie nie znajduje się w bazie.",
      "Podana porcja znajduje się już w bazie.":"Zwierze posiada już tę porcję w swojej diecie",
      "Podane leczenie znajduje się już w bazie.":"Zwierzę odbyło już podane leczenie",
      "Podane zadanie znajduje się już w bazie.": "Pracownik posiada już takie zadanie",
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
          status: errorKeys[result?.response?.data] ? "info" : "error",
          description: errorKeys[result?.response?.data] ?? error,
          duration: 5000,
        });
        return result;
      });
  };

  return useMemo(() => ({ promise: handlePromise }), []);
};
