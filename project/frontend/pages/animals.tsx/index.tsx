import { Button, Flex, Grid, GridItem, Text, Tooltip, Icon } from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import BreadCrumb from "../../components/Breadcrumb";
import { Edit, Trash2, MoreHorizontal } from "react-feather";
import Table from "../../components/common/Table";
import Layout from "../../components/Layout";
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import {
  animal1,
  animal2,
  animal3,
  animal4,
  animal5,
} from "../../mock/animals";
import Link from "next/link";
import { AutocompleteItem } from "../../types/interfaces";

const animals = [animal1, animal2, animal3, animal4, animal5];

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
      accessor: ({ birthDate }: {birthDate: Date}) => <Text>{format(birthDate,"dd/MM/yyyy")}</Text>,
    },
    {
        Header: "Gatunek",
        accessor: ({ spiece }) => <Text>{spiece?.name}</Text>,
      },
      {
        Header: "Zagroda",
        accessor: ({ pan }) => <Text>{pan?.name}</Text>,
      },
    {
      id: "edit",
      accessor: ({ id }) => (
        <Flex width="100%" justifyContent="flex-end" fontSize="18px" lineHeight={1} gap={2}>
          <Tooltip hasArrow label="Edytuj" placement="top">
            <Link href={`/animals/form/${id}`}>
              <Icon as={Edit} />
            </Link>
          </Tooltip>
          <Tooltip hasArrow label="Usuń" placement="top">
            <Link href={`/projects/edit/${id}`}>
              <Icon as={Trash2} color="red.400" />
            </Link>
          </Tooltip>
          <Tooltip hasArrow label="Szczegóły" placement="top">
            <Link href={`/animals/edit/${id}`}>
              <Icon as={MoreHorizontal} />
            </Link>
          </Tooltip>
        </Flex>
      ),
    },
  ];

const AnimalsPage = (): React.ReactElement => {
  const router = useRouter();

  const handleCreateItem = (item: AutocompleteItem) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems?: AutocompleteItem[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };

  const animalOptions = useMemo(() => {
    if (animals?.length > 0) {
      return animals?.map((animal) => ({
        value: animal?.id,
        label: animal?.name,
      }));
    }
    return [];
  }, [animals]);
  console.log(animalOptions);
  const [pickerItems, setPickerItems] = useState(animalOptions);
  const [selectedItems, setSelectedItems] = useState<AutocompleteItem[]>([]);

  return (
    <>
      <Flex justifyContent="space-between">
        <BreadCrumb
          breadcrumb={[
            { label: "Zwierzęta", isCurrentPage: true, href: "/animals" },
          ]}
        />
        <Button onClick={() => router.push("/animals/form")}>
          Dodaj zwierzę
        </Button>
      </Flex>
        {animalOptions?.length > 0 && (
          <CUIAutoComplete
            label="Wyszukaj zwierzę"
            placeholder="Imię..."
            onCreateItem={handleCreateItem}
            items={pickerItems}
            selectedItems={selectedItems}
            onSelectedItemsChange={(changes) =>
              handleSelectedItemsChange(changes.selectedItems)
            }
          />
        )}
      <Table data={animals} columns={columns} searchBar={false}/>
    </>
  );
};

AnimalsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default AnimalsPage;
