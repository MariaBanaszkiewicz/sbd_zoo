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

const TeamsPage = (): React.ReactElement => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const { data: teams, error } = useSWR("/teams");
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
    if (typeClicked == "team") {
      return toast.promise(
        axios.delete(`/team/${idClicked}`).then(() => {
          mutate("/teams");
          router.push(`/`);
        })
      );
    }
    if (typeClicked == "employee") {
      const body = { employee: idClicked, team: teams?.[tabIndex]?.name };
      return toast.promise(
        axios.delete(`/employeeTeams`, { data: body }).then(() => {
          mutate("/teams");
          mutate("/employees");
          onDeleteClose();
        })
      );
    }
  };

  const onEmployeeSubmit = (data) => {
    return toast.promise(
      axios
        .post(`/employeeTeams`, {
          employee: data?.employee,
          team: teams?.[tabIndex]?.name,
        })
        .then(() => {
          mutate("/teams");
          mutate("/employees");
          onEmployeeClose();
        })
    );
  };

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
          <Tooltip hasArrow label="Usuń pracownika z zespołu" placement="top">
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
          <ModalHeader>Dodaj pracownika do zespołu</ModalHeader>
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
            { label: "Zespoły", isCurrentPage: true, href: "/teams" },
          ]}
        />
        <Button onClick={() => router.push("/team/form/0")}>
          Dodaj zespół
        </Button>
      </Flex>

      {teams?.length > 0 ? (
        <Tabs onChange={(index) => setTabIndex(index)}>
          <TabList>
            {teams?.map((team, index) => (
              <Tab key={index} onClick={() => setIdClicked(team?.name)}>
                {team?.name}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {teams?.map((team, index) => (
              <TabPanel key={index}>
                <Flex justifyContent="flex-end" gap={3}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTypeClicked("team");
                      setIdClicked(team?.name);
                      onDeleteOpen();
                    }}
                  >
                    Usuń
                  </Button>
                  <Button
                    onClick={() => router.push(`/team/form/${team?.name}`)}
                  >
                    Edytuj
                  </Button>
                </Flex>

                <SimpleGrid gap={5} columns={2} mb={5}>
                  <Text textAlign="end">Nazwa: </Text>
                  <Text>{team?.name || "-"}</Text>
                  <Text textAlign="end">Typ: </Text>
                  <Text>{team?.type || "-"}</Text>
                </SimpleGrid>
                <Divider mb={5} />
                <Flex flexDirection="column">
                  <Flex justifyContent="space-between">
                    <Text fontSize="xl" fontWeight={700}>
                      Pracownicy
                    </Text>
                    <Button
                      onClick={() => {
                        setIdClicked(teams?.[tabIndex]?.name);
                        onEmployeeOpen();
                      }}
                    >
                      Dodaj pracownika do zespołu
                    </Button>
                  </Flex>
                  {team?.employees?.length > 0 ? (
                    <Table data={team?.employees} columns={employeesColumns} />
                  ) : (
                    <Text mt={5}>
                      Do tego zespołu nie został przydzielony żaden pracownik
                    </Text>
                  )}
                </Flex>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ): <Text>W ZOO nie istnieją jeszcze zespoły</Text>}
    </>
  );
};

TeamsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default TeamsPage;
