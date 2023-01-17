import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  Spinner
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Edit, MoreHorizontal, Trash2, UserX } from "react-feather";
import useSWR, { mutate } from "swr";
import BreadCrumb from "../components/Breadcrumb";
import DeleteDialog from "../components/common/DeleteDialog";
import Table from "../components/common/Table";
import Layout from "../components/Layout";
import { useToastPromise } from "../hooks/useToast";
import SelectAdvanced from "../components/common/SelectAdvanced";
import { Controller, FormProvider, useForm } from "react-hook-form";
import axios from "axios";

type EmployeeInputs = {
  employee: any;
};

const PensPage = (): React.ReactElement => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [defaultIndex, setDefaultIndex] = useState(0);
  const { data: pens, error, isValidating } = useSWR("/runs");
  const [idClicked, setIdClicked] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToastPromise();
  const cancelRef = useRef();
  const [typeClicked, setTypeClicked] = useState("");
  const {
    isOpen: isEmployeeOpen,
    onOpen: onEmployeeOpen,
    onClose: onEmployeeClose,
  } = useDisclosure();

  const { data: employeeData } = useSWR("/employees");

  const employeeOptions = employeeData?.map((employee) => ({
    value: employee?.pesel,
    label: employee?.fisrtName + " " + employee?.lastName,
  }));

  const employeeMethods = useForm<EmployeeInputs>();
  const {
    handleSubmit: handleemployeeSubmit,
    control: controlemployee,
    formState: { errors: employeeErrors, isSubmitting: isemployeeSubmitting },
  } = employeeMethods;

  const onDelete = () => {
    if (typeClicked == "pen") {
      return toast.promise(
        axios.delete(`/run/${idClicked}`).then(() => {
          mutate("/runs");
          mutate("/animals");
          mutate("/employees");
        })
      );
    }
    if (typeClicked == "animal") {
      setDefaultIndex(tabIndex);
      return toast.promise(
        axios.delete(`/animal/${idClicked}`).then(() => {
          mutate("/runs");
          mutate("/animals");
          onDeleteClose();
        })
      );
    }
    if (typeClicked == "employee") {
      setDefaultIndex(tabIndex);
      const body = { employee: idClicked, run: pens?.[tabIndex]?.name };
      return toast.promise(
        axios.delete(`/employeeRuns`, { data: body }).then(() => {
          mutate("/runs");
          mutate("/employees");
          onDeleteClose();
        })
      );
    }
  };

  const onEmployeeSubmit = (data) => {
    setDefaultIndex(tabIndex);
    return toast.promise(
      axios.post(`/employeeRuns`, {employee: data?.employee, run: pens?.[tabIndex]?.name }).then(() => {
        mutate("/runs");
        mutate("/employees");
        onEmployeeClose();
      })
    );
  }

  const animalsColumns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Imię",
      accessor: "name",
    },
    {
      Header: "Gatunek",
      accessor: "species",
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
                setTypeClicked("animal");
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

  const employeesColumns = [
    {
      Header: "Imię",
      accessor: "fisrtName",
    },
    {
      Header: "Nazwisko",
      accessor: "lastName",
    },
    {
      id: "edit",
      accessor: ({ pesel }) => (
        <Flex
          width="100%"
          justifyContent="flex-end"
          fontSize="18px"
          lineHeight={1}
          gap={2}
        >
          <Tooltip hasArrow label="Edytuj" placement="top">
            <Link href={`/employee/form/${pesel}`}>
              <Icon as={Edit} />
            </Link>
          </Tooltip>
          <Tooltip hasArrow label="Usuń pracownika z zagrody" placement="top">
            <Icon
              as={UserX}
              color="red.400"
              onClick={() => {
                setTypeClicked("employee");
                setIdClicked(pesel);
                onDeleteOpen();
              }}
            />
          </Tooltip>

          <Tooltip hasArrow label="Szczegóły" placement="top">
            <Link href={`/employee/${pesel}`}>
              <Icon as={MoreHorizontal} />
            </Link>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <>
      <Modal
        isCentered
        size="4xl"
        isOpen={isEmployeeOpen}
        onClose={onEmployeeClose}
        preserveScrollBarGap
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj pracownika do zagrody</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...employeeMethods}>
              <form
                onSubmit={handleemployeeSubmit(onEmployeeSubmit)}
                noValidate
              >
                <Flex flexDirection="column" gap={4}>
                  <FormControl isInvalid={!!employeeErrors.employee} isRequired>
                    <FormLabel htmlFor="name">Wybierz pracownika</FormLabel>
                    <Controller
                      control={controlemployee}
                      name="employee"
                      rules={{ required: true }}
                      render={({ field: { onChange, value, ref } }) => (
                        <SelectAdvanced
                          inputRef={ref}
                          value={employeeOptions?.find(
                            (c) => value === c.value
                          )}
                          onChange={(val) => onChange(val.value)}
                          options={employeeOptions}
                          isInvalid={!!employeeErrors.employee}
                          isClearable={false}
                        />
                      )}
                    />
                    {employeeErrors.employee && (
                      <FormErrorMessage>Pole wymagane</FormErrorMessage>
                    )}
                  </FormControl>

                  <Flex justifyContent="flex-end">
                    <Button type="submit" isLoading={isemployeeSubmitting}>
                      Zapisz
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </FormProvider>
          </ModalBody>
        </ModalContent>
      </Modal>

      <DeleteDialog
        isOpen={isDeleteOpen}
        cancelRef={cancelRef}
        onClose={onDeleteClose}
        onDelete={onDelete}
      />
      <Flex justifyContent="space-between">
        <BreadCrumb
          breadcrumb={[
            { label: "Zagrody", isCurrentPage: true, href: "/pens" },
          ]}
        />
        <Button onClick={() => router.push("/pen/form/0")}>
          Dodaj zagrodę
        </Button>
      </Flex>
      {error && <Text>Wystąpił błąd podczas pobierania danych</Text>}
      {isValidating && <Flex justifyContent="center"><Spinner/></Flex>}
      {pens?.length ==0 && !isValidating && <Text>W ZOO nie ma jeszcze zagród</Text> }
      {pens?.length > 0 && !isValidating && (
        <Tabs onChange={(index) => setTabIndex(index)} defaultIndex={defaultIndex}>
          <TabList>
            {pens?.map((pen, index) => (
              <Tab key={index} onClick={() => setIdClicked(pen?.id)}>
                {pen?.name}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {pens?.map((pen, index) => (
              <TabPanel key={index}>
                <Flex justifyContent="flex-end" gap={3}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTypeClicked("pen");
                      setIdClicked(pen?.name);
                      onDeleteOpen();
                    }}
                  >
                    Usuń
                  </Button>
                  <Button onClick={() => router.push(`/pen/form/${pen?.name}`)}>
                    Edytuj
                  </Button>
                </Flex>

                <SimpleGrid gap={5} columns={2} mb={5}>
                  <Text textAlign="end">Klimat: </Text>
                  <Text>{pen?.climate || "-"}</Text>
                  <Text textAlign="end">Rozmiar [a]: </Text>
                  <Text>{pen?.size || "-"}</Text>
                </SimpleGrid>
                <Divider mb={5} />
                <SimpleGrid columns={2} gap={7}>
                  <Flex flexDirection="column">
                    <Flex justifyContent="space-between">
                      <Text fontSize="xl" fontWeight={700}>
                        Zwierzęta
                      </Text>
                      <Button
                        onClick={() => {
                          router?.push("/animals/form/0");
                        }}
                      >
                        Dodaj zwierzę
                      </Button>
                    </Flex>

                    {pen?.animals?.length > 0 ? (
                      <Table data={pen?.animals} columns={animalsColumns} />
                    ) : (
                      <Text mt={5}>
                        W tej zagrodzie nie znajduje się żadne zwierzę
                      </Text>
                    )}
                  </Flex>
                  <Flex flexDirection="column">
                    <Flex justifyContent="space-between">
                      <Text fontSize="xl" fontWeight={700}>
                        Pracownicy
                      </Text>
                      <Button
                        onClick={() => {
                          setIdClicked(pens?.[tabIndex]?.name);
                          onEmployeeOpen();
                        }}
                      >
                        Dodaj pracownika do zagrody
                      </Button>
                    </Flex>
                    {pen?.employees?.length > 0 ? (
                      <Table data={pen?.employees} columns={employeesColumns} />
                    ) : (
                      <Text mt={5}>
                        Do tej zagrody nie został przydzielony żaden pracownik
                      </Text>
                    )}
                  </Flex>
                </SimpleGrid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </>
  );
};

PensPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default PensPage;
