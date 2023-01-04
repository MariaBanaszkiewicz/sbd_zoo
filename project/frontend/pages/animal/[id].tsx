import {
  Button,
  Divider,
  Flex,
  Icon,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Edit, Trash2 } from "react-feather";
import useSWR, { mutate } from "swr";
import BreadCrumb from "../../components/Breadcrumb";
import DeleteDialog from "../../components/common/DeleteDialog";
import Table from "../../components/common/Table";
import Layout from "../../components/Layout";
import { useToastPromise } from "../../hooks/useToast";

const AnimalPage = (): React.ReactElement => {
  const router = useRouter();
  const toast = useToastPromise();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const { id } = router.query;

  const { data, error } = useSWR(`/animal/${id}`);
  const { data: employeeData } = useSWR(
    data?.animal?.employee ? `/employee/${data?.animal?.employee}` : null
  );
  const cancelRef = useRef();
  const [typeClicked, setTypeClicked] = useState("");
  const [whichClicked, setWhichClicked] = useState(null);

  const onDelete = () => {
    if (typeClicked == "animal")
      return toast.promise(
        axios.delete(`/animal/${id}`).then(() => {
          mutate("/animals");
          router.push(`/animals`);
        })
      );


      // TODO nie działa usuwanie leczenia i nie działa usuwanie porcji
    if (typeClicked == "treatment") {
      return toast.promise(
        axios.delete(`/treatments`, whichClicked).then(() => {
          mutate(`/animal/${id}`);
          mutate("/treatments");
        })
      );
    }
    if (typeClicked == "serving") {
      return toast.promise(
        axios.delete(`/serving/${id}+${whichClicked.name}`).then(() => {
          mutate(`/animal/${id}`);
          mutate("/servings");
        })
      );
    }
  };

  const servingsColumns = [
    {
      Header: "Jedzenie",
      accessor: "food",
    },
    {
      Header: "Ilość na dzień",
      accessor: "amount",
    },
    {
      Header: "Jednostka",
      accessor: "unit",
    },
    {
      id: "edit",
      Cell: ({ row }) => (
        <Flex
          width="100%"
          justifyContent="flex-end"
          fontSize="18px"
          lineHeight={1}
          gap={2}
        >
          <Tooltip hasArrow label="Edytuj" placement="top">
            <Icon as={Edit} />
          </Tooltip>
          <Tooltip hasArrow label="Usuń" placement="top">
            <Icon
              as={Trash2}
              color="red.400"
              onClick={() => {
                setTypeClicked("serving");
                setWhichClicked(row?.original);
                onDeleteOpen();
              }}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];
  const treatmentsColumns = [
    {
      Header: "Nazwa choroby",
      accessor: "disease",
    },
    {
      Header: "Opis",
      accessor: "description",
    },
    {
      Header: "Data",
      accessor: ({ date }) => (
        <Text>{format(new Date(date), "dd/MM/yyyy")}</Text>
      ),
    },
    {
      id: "edit",
      Cell: ({ row }) => (
        <Flex
          width="100%"
          justifyContent="flex-end"
          fontSize="18px"
          lineHeight={1}
          gap={2}
        >
          <Tooltip hasArrow label="Edytuj" placement="top">
            <Icon as={Edit} />
          </Tooltip>
          <Tooltip hasArrow label="Usuń" placement="top">
            <Icon
              as={Trash2}
              color="red.400"
              onClick={() => {
                setTypeClicked("treatment");
                setWhichClicked(row?.original);
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
            { label: "Zwierzęta", isCurrentPage: false, href: "/animals" },
            {
              label: "Szczegóły zwierzęcia",
              isCurrentPage: true,
              href: `/animal/${id}`,
            },
          ]}
        />
        <Flex justifyContent="flex-end" gap={3}>
          <Button
            variant="outline"
            onClick={() => {
              setTypeClicked("animal");
              onDeleteOpen();
            }}
          >
            Usuń
          </Button>
          <Button onClick={() => router.push(`/animals/form/${id}`)}>
            Edytuj
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid gap={5} columns={2} mb={5}>
        <Text textAlign="end">ID zwierzęcia: </Text>
        <Text>{data?.animal?.id || "-"}</Text>
        <Text textAlign="end">Imię: </Text>
        <Text>{data?.animal?.name || "-"}</Text>
        <Text textAlign="end">Gatunek: </Text>
        <Text>{data?.animal?.species || "-"}</Text>
        <Text textAlign="end">Wybieg: </Text>
        <Text>{data?.animal?.run || "-"}</Text>
        <Text textAlign="end">Data urodzenia: </Text>
        <Text>
          {data?.animal?.birthDate
            ? format(new Date(data?.animal?.birthDate), "dd/MM/yyyy")
            : "-"}
        </Text>
        <Text textAlign="end">Data przybycia do zoo: </Text>
        <Text>
          {data?.animal?.zooDate
            ? format(new Date(data?.animal?.zooDate), "dd/MM/yyyy")
            : "-"}
        </Text>
        <Text textAlign="end">Główny opiekun: </Text>
        <Text>
          {employeeData?.employee
            ? employeeData?.employee?.fisrtName +
              " " +
              employeeData?.employee?.lastName
            : "-"}
        </Text>
      </SimpleGrid>
      <Divider mb={5} />
      <SimpleGrid columns={2} gap={7}>
        <Flex flexDirection="column">
          <Flex justifyContent="space-between">
            <Text fontSize="xl" fontWeight={700}>
              Dieta dzienna
            </Text>
            <Button>Dodaj porcję</Button>
          </Flex>

          {data?.servings?.length > 0 ? (
            <Table data={data?.servings} columns={servingsColumns} />
          ) : (
            <Text>Dieta tego zwierzęcia nie została jeszcze wprowadzona</Text>
          )}
        </Flex>
        <Flex flexDirection="column">
          <Flex justifyContent="space-between">
            <Text fontSize="xl" fontWeight={700}>
              Historia leczenia
            </Text>
            <Button>Dodaj leczenie</Button>
          </Flex>
          {data?.treatments?.length > 0 ? (
            <Table data={data?.treatments} columns={treatmentsColumns} />
          ) : (
            <Text>To zwierzę nie posiada historii leczenia</Text>
          )}
        </Flex>
      </SimpleGrid>
    </>
  );
};

AnimalPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default AnimalPage;
