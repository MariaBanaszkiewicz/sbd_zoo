import {
    Button,
    Flex,
    Icon,
    SimpleGrid,
    Text,
    Tooltip,
    useDisclosure
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
  
  const ClimatesPage = (): React.ReactElement => {
    const router = useRouter();
    const { data: climates, error } = useSWR("/climates");
    const [idClicked,setIdClicked] = useState(null);
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
            mutate("/climates");
          })
        );
      };

      const columns = [

        {
          Header: "Nazwa",
          accessor: "name",
        },
        {
          Header: "Roślinność",
          accessor: "flora",
        },
        {
          Header: "Średnia temp. dobowa [C]",
          accessor: "temperatur"
        },
        {
            Header: "Wilgotność powietrza [%]",
            accessor: "humidity"
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
                <Link href={`/climate/form/${name}`}>
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
                { label: "Klimaty", isCurrentPage: true, href: "/climates" },
              ]}
            />
            <Button onClick={() => router.push("/climate/form/0")}>
              Dodaj klimat
            </Button>
          </Flex>
          {climates?.length > 0 && (
        <Table data={climates} columns={columns} searchBar={false} />
      )}
    </>);
};

ClimatesPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default ClimatesPage;