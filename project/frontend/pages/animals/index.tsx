import {
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Edit, MoreHorizontal, Trash2 } from "react-feather";
import useSWR, { mutate } from "swr";
import BreadCrumb from "../../components/Breadcrumb";
import DeleteDialog from "../../components/common/DeleteDialog";
import Table from "../../components/common/Table";
import Layout from "../../components/Layout";
import { useToastPromise } from "../../hooks/useToast";
import { AutocompleteItem } from "../../types/interfaces";

const AnimalsPage = (): React.ReactElement => {
  const router = useRouter();
  const { data: animals, error, isValidating } = useSWR("/animals");
  const [idClicked, setIdClicked] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToastPromise();
  const cancelRef = useRef();

  const onDelete = () => {
    return toast.promise(
      axios.delete(`/animal/${idClicked}`).then(() => {
        mutate("/animals");
        router.push(`/animals`);
      })
    );
  };

  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Imię",
      accessor: "name",
    },
    {
      Header: "Data urodzenia",
      accessor: ({ birthDate }: { birthDate }) => (
        <Text>
          {format(birthDate ? new Date(birthDate) : new Date(), "dd/MM/yyyy")}
        </Text>
      ),
    },
    {
      Header: "Data przybycia do zoo",
      accessor: ({ zooDate }: { zooDate }) => (
        <Text>
          {format(zooDate ? new Date(zooDate) : new Date(), "dd/MM/yyyy")}
        </Text>
      ),
    },
    {
      Header: "Gatunek",
      accessor: "species",
    },
    {
      Header: "Zagroda",
      accessor: "run",
    },
    {
      id: "edit",
      accessor: ({ id }) => (
        <Flex
          width="100%"
          justifyContent="flex-end"
          fontSize="18px"
          lineHeight={1}
          gap={2}
        >
          <Tooltip hasArrow label="Edytuj" placement="top">
            <Link href={`/animals/form/${id}`}>
              <Icon as={Edit} />
            </Link>
          </Tooltip>
          <Tooltip hasArrow label="Usuń" placement="top">
            <Icon
              as={Trash2}
              color="red.400"
              onClick={() => {
                setIdClicked(id);
                onDeleteOpen();
              }}
            />
          </Tooltip>
          <Tooltip hasArrow label="Szczegóły" placement="top">
            <Link href={`/animal/${id}`}>
              <Icon as={MoreHorizontal} />
            </Link>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const animalOptions = useMemo(() => {
    if (animals?.length > 0) {
      return animals?.map((animal) => ({
        value: animal?.id,
        label: animal?.name,
      }));
    }
    return [];
  }, [animals]);

  const runOptions = useMemo(() => {
    if (animals?.length > 0) {
      const runs = [];
      animals?.forEach((animal) => {
        if (runs.findIndex((run) => run == animal.run) == -1) {
          runs.push(animal?.run);
        }
      });
      return runs?.map((run, index) => ({ label: run, value: index }));
    }
    return [];
  }, [animals]);

  const speciesOptions = useMemo(() => {
    if (animals?.length > 0) {
      const species = [];
      animals?.forEach((animal) => {
        if (species.findIndex((specie) => specie == animal.species) == -1) {
          species.push(animal?.species);
        }
      });
      return species?.map((specie, index) => ({ label: specie, value: index }));
    }
    return [];
  }, [animals]);

  const handleCreateNameItem = (item: AutocompleteItem) => {
    setPickerNameItems((curr) => [...curr, item]);
    setSelectedNameItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsNameChange = (
    selectedItems?: AutocompleteItem[]
  ) => {
    if (selectedItems) {
      setSelectedNameItems(selectedItems);
    }
  };

  const [pickerNameItems, setPickerNameItems] = useState(animalOptions);

  const [selectedNameItems, setSelectedNameItems] = useState<
    AutocompleteItem[]
  >([]);

  const selectedNamesId = selectedNameItems?.map((animal) => animal?.value);

  const handleCreateRunItem = (item: AutocompleteItem) => {
    setPickerRunItems((curr) => [...curr, item]);
    setSelectedRunItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsRunChange = (selectedItems?: AutocompleteItem[]) => {
    if (selectedItems) {
      setSelectedRunItems(selectedItems);
    }
  };

  const [pickerRunItems, setPickerRunItems] = useState(runOptions);
  const [selectedRunItems, setSelectedRunItems] = useState<AutocompleteItem[]>(
    []
  );

  const selectedRunsId = selectedRunItems?.map((run) => run?.label);

  const handleCreateSpecieItem = (item: AutocompleteItem) => {
    setPickerSpecieItems((curr) => [...curr, item]);
    setSelectedSpecieItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsSpecieChange = (
    selectedItems?: AutocompleteItem[]
  ) => {
    if (selectedItems) {
      setSelectedSpecieItems(selectedItems);
    }
  };

  const [pickerSpecieItems, setPickerSpecieItems] = useState(speciesOptions);
  const [selectedSpecieItems, setSelectedSpecieItems] = useState<
    AutocompleteItem[]
  >([]);

  const selectedSpeciesId = selectedSpecieItems?.map((specie) => specie?.label);

  const getAnimalsList = useCallback(
    (animals) => {
      const animalsGrouped = animals?.filter((animal) => {
        if (
          (selectedNamesId?.length > 0 &&
            !selectedNamesId?.includes(animal?.id)) ||
          (selectedRunsId?.length > 0 &&
            !selectedRunsId?.includes(animal?.run)) ||
          (selectedSpeciesId?.length > 0 &&
            !selectedSpeciesId?.includes(animal?.species))
        ) {
          return false;
        }
        return true;
      });
      return animalsGrouped;
    },
    [selectedNamesId]
  );
  const animalsList = useMemo(
    () => getAnimalsList(animals),
    [animals, selectedNamesId]
  );

  useEffect(() => {
    setPickerNameItems(animalOptions);
    setPickerRunItems(runOptions);
    setPickerSpecieItems(speciesOptions);
  }, [animalOptions, speciesOptions, runOptions]);

  return (
    <>
      <DeleteDialog
        isOpen={isDeleteOpen}
        cancelRef={cancelRef}
        onClose={onDeleteClose}
        onDelete={onDelete}
      />
      <Flex justifyContent="space-between">
        <BreadCrumb
          breadcrumb={[
            { label: "Zwierzęta", isCurrentPage: true, href: "/animals" },
          ]}
        />
        <Button onClick={() => router.push("/animals/form/0")}>
          Dodaj zwierzę
        </Button>
      </Flex>
      {error && <Text>Wystąpił błąd podczas pobierania danych</Text>}
      {isValidating && <Flex justifyContent="center"><Spinner/></Flex>}
      {!error && !isValidating && (
        <>
          <SimpleGrid columns={3} gap={5}>
            {animalOptions?.length > 0 && (
              <CUIAutoComplete
                label="Filtruj po imionach"
                placeholder="Imię..."
                onCreateItem={handleCreateNameItem}
                disableCreateItem
                items={pickerNameItems}
                selectedItems={selectedNameItems}
                onSelectedItemsChange={(changes) =>
                  handleSelectedItemsNameChange(changes.selectedItems)
                }
              />
            )}

            {runOptions?.length > 0 && (
              <CUIAutoComplete
                label="Filtruj po zagrodach"
                placeholder="Zagroda..."
                onCreateItem={handleCreateRunItem}
                items={pickerRunItems}
                disableCreateItem
                selectedItems={selectedRunItems}
                onSelectedItemsChange={(changes) =>
                  handleSelectedItemsRunChange(changes.selectedItems)
                }
              />
            )}
            {speciesOptions?.length > 0 && (
              <CUIAutoComplete
                label="Filtruj po gatunkach"
                placeholder="Gatunek..."
                disableCreateItem
                onCreateItem={handleCreateSpecieItem}
                items={pickerSpecieItems}
                selectedItems={selectedSpecieItems}
                onSelectedItemsChange={(changes) =>
                  handleSelectedItemsSpecieChange(changes.selectedItems)
                }
              />
            )}
          </SimpleGrid>
          {animalsList?.length > 0 ? (
            <Table data={animalsList} columns={columns} />
          ) : (
            <Text>W ZOO nie ma żadnych zwierząt</Text>
          )}
        </>
      )}
    </>
  );
};

AnimalsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default AnimalsPage;
