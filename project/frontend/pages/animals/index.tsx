import {
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { Edit, MoreHorizontal, Trash2 } from "react-feather";
import useSWR from "swr";
import BreadCrumb from "../../components/Breadcrumb";
import Table from "../../components/common/Table";
import Layout from "../../components/Layout";
import { AutocompleteItem } from "../../types/interfaces";

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
      <Text>{format(new Date(birthDate), "dd/MM/yyyy")}</Text>
    ),
  },
  {
    Header: "Data przybycia do zoo",
    accessor: ({ zooDate }: { zooDate }) => (
      <Text>{format(new Date(zooDate), "dd/MM/yyyy")}</Text>
    ),
  },
  {
    Header: "Gatunek",
    accessor: ({ species }) => <Text>{species}</Text>,
  },
  {
    Header: "Zagroda",
    accessor: ({ run }) => <Text>{run}</Text>,
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
            onClick={() => console.log(`delete ${id}`)}
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

const AnimalsPage = (): React.ReactElement => {
  const router = useRouter();
  const { data: animals, error } = useSWR("/animals");

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

  console.log(animalOptions, runOptions, speciesOptions);

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
          console.log(animal?.id);
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

  console.log("finalList", animalsList);

  return (
    <>
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
      <SimpleGrid columns={3} gap={5}>
        {animalOptions?.length > 0 && (
          <CUIAutoComplete
            label="Filtruj po imionach"
            placeholder="Imię..."
            onCreateItem={handleCreateNameItem}
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
            onCreateItem={handleCreateSpecieItem}
            items={pickerSpecieItems}
            selectedItems={selectedSpecieItems}
            onSelectedItemsChange={(changes) =>
              handleSelectedItemsSpecieChange(changes.selectedItems)
            }
          />
        )}
      </SimpleGrid>
      {animalsList?.length > 0 && (
        <Table data={animalsList} columns={columns} searchBar={false} />
      )}
    </>
  );
};

AnimalsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default AnimalsPage;
