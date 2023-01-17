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

const FoodsPage = (): React.ReactElement => {
  const router = useRouter();
  const { data: foods, error, isValidating } = useSWR("/food");
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
      axios.delete(`/food/${idClicked}`).then(() => {
        mutate("/food");
      })
    );
  };

  const columns = [
    {
      Header: "Nazwa",
      accessor: "name",
    },
    {
      Header: "Jednostka",
      accessor: "unit",
    },
    {
      Header: "Typ",
      accessor: "type",
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
            <Link href={`/food/form/${name}`}>
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
            { label: "Jedzenie", isCurrentPage: true, href: "/foods" },
          ]}
        />
        <Button onClick={() => router.push("/food/form/0")}>
          Dodaj jedzenie
        </Button>
      </Flex>
      {error && <Text>Wystąpił błąd podczas pobierania danych</Text>}
      {isValidating && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {foods?.length > 0 && !isValidating && (
        <Table data={foods} columns={columns} />
      )}
      {foods?.length == 0 && !isValidating && (
        <Text>Brak dostępnych rodzajów jedzenia</Text>
      )}
    </>
  );
};

FoodsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default FoodsPage;
