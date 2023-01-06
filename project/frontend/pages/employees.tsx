import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
  FormErrorMessage,
  ModalBody
} from "@chakra-ui/react";
import axios from "axios";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Edit, MoreHorizontal, Trash2, Users } from "react-feather";
import { Controller, FormProvider, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import BreadCrumb from "../components/Breadcrumb";
import DeleteDialog from "../components/common/DeleteDialog";
import SelectAdvanced from "../components/common/SelectAdvanced";
import Table from "../components/common/Table";
import Layout from "../components/Layout";
import { useToastPromise } from "../hooks/useToast";
import { AutocompleteItem } from "../types/interfaces";

type EmployeeInputs = {
  employee: any;
};

const EmployeesPage = (): React.ReactElement => {
  const router = useRouter();
  const { data: employees, error } = useSWR("/employees");
  const [idClicked, setIdClicked] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToastPromise();
  const cancelRef = useRef();
  const {
    isOpen: isEmployeeOpen,
    onOpen: onEmployeeOpen,
    onClose: onEmployeeClose,
  } = useDisclosure();

  const employeeOptions = employees?.map((employee) => ({
    value: employee?.pesel,
    label: employee?.fisrtName + " " + employee?.lastName,
  }));

  const employeeMethods = useForm<EmployeeInputs>();
  const {
    handleSubmit: handleemployeeSubmit,
    control: controlemployee,
    formState: { errors: employeeErrors, isSubmitting: isemployeeSubmitting },
  } = employeeMethods;

  const onEmployeeSubmit = (data) => {
    return toast.promise(
      axios
        .put(`/employee/transfer/${idClicked}+${data?.employee}`)
        .then(() => {
          mutate("/employees");
          onEmployeeClose();
        })
    );
  };

  const onDelete = () => {
    return toast.promise(
      axios.delete(`/employee/${idClicked}`).then(() => {
        mutate("/employees");
      })
    );
  };

  const columns = [
    {
      Header: "PESEL",
      accessor: "pesel",
    },
    {
      Header: "Imię",
      accessor: "fisrtName",
    },
    {
      Header: "Nazwisko",
      accessor: "lastName",
    },
    {
      Header: "Data zatrudnienia",
      accessor: ({ dateOfEmployment }) => (
        <Text>
          {format(
            dateOfEmployment ? new Date(dateOfEmployment) : new Date(),
            "dd/MM/yyyy"
          )}
        </Text>
      ),
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
          <Tooltip hasArrow label="Usuń" placement="top">
            <Icon
              as={Trash2}
              color="red.400"
              onClick={() => {
                setIdClicked(pesel);
                onDeleteOpen();
              }}
            />
          </Tooltip>
          <Tooltip
            hasArrow
            label="Przekaż zadania innemu pracownikowi"
            placement="top"
          >
            <Icon
              as={Users}
              onClick={() => {
                setIdClicked(pesel);
                onEmployeeOpen();
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
          <ModalHeader>Przekaż zadania</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...employeeMethods}>
              <form
                onSubmit={handleemployeeSubmit(onEmployeeSubmit)}
                noValidate
              >
                <Flex flexDirection="column" gap={4}>
                  <FormControl isInvalid={!!employeeErrors.employee} isRequired>
                    <FormLabel htmlFor="name">Wybierz pracownika, który ma przejąć zadania</FormLabel>
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
            { label: "Zwierzęta", isCurrentPage: true, href: "/animals" },
          ]}
        />
        <Button onClick={() => router.push("/employee/form/0")}>
          Dodaj pracownika
        </Button>
      </Flex>
      {employees?.length > 0 ? (
        <Table data={employees} columns={columns} />
      ) : (
        <Text>Zoo nie posiada żadnych pracowników</Text>
      )}
    </>
  );
};

EmployeesPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default EmployeesPage;
