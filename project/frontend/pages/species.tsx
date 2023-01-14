import {
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Edit, MoreHorizontal, Trash2 } from "react-feather";
import useSWR, { mutate } from "swr";
import BreadCrumb from "../components/Breadcrumb";
import DeleteDialog from "../components/common/DeleteDialog";
import Table from "../components/common/Table";
import Layout from "../components/Layout";
import { useToastPromise } from "../hooks/useToast";
import { AutocompleteItem } from "../types/interfaces";

const SpeciesPage = (): React.ReactElement => {
  const router = useRouter();
  const { data: species, error, isValidating } = useSWR("/species");
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
      axios.delete(`/species/${idClicked}`).then(() => {
        mutate("/species");
      })
    );
  };

  const columns = [
    {
      Header: "Nazwa",
      accessor: "name",
    },
    {
      Header: "Gromada",
      accessor: "theClass",
    },
    {
      id: "edit",
      accessor: ({ name }) => (
        <Flex
          width="100%"
          justifyContent="flex-end"
          fontSize="18px"
          lineHeight={1}
          gap={2}
        >
          <Tooltip hasArrow label="Edytuj" placement="top">
            <Link href={`/specie/form/${name}`}>
              <Icon as={Edit} />
            </Link>
          </Tooltip>
          <Tooltip hasArrow label="Usuń" placement="top">
            <Icon
              as={Trash2}
              color="red.400"
              onClick={() => {
                setIdClicked(name);
                onDeleteOpen();
              }}
            />
          </Tooltip>
          <Tooltip hasArrow label="Szczegóły" placement="top">
            <Link href={`/specie/${name}`}>
              <Icon as={MoreHorizontal} />
            </Link>
          </Tooltip>
        </Flex>
      ),
    },
  ];

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
            { label: "Gatunki", isCurrentPage: true, href: "/species" },
          ]}
        />
        <Button onClick={() => router.push("/specie/form/0")}>
          Dodaj gatunek
        </Button>
      </Flex>
      {error && <Text>Wystąpił błąd podczas pobierania danych</Text>}
      {isValidating && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {species?.length > 0 && !isValidating && (
        <Table data={species} columns={columns} searchBar={false} />
      )}
      {species?.length == 0 && !isValidating && <Text>Brak gatunków</Text>}
    </>
  );
};

SpeciesPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default SpeciesPage;
