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
    Text,
    Textarea,
    Tooltip,
    useDisclosure,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { format } from "date-fns";
  import { useRouter } from "next/router";
  import { useEffect, useRef, useState } from "react";
  import { Edit, Trash2 } from "react-feather";
  import { Controller, FormProvider, useForm } from "react-hook-form";
  import useSWR, { mutate } from "swr";
import { idText } from "typescript";
  import BreadCrumb from "../../components/Breadcrumb";
  import DateInput from "../../components/common/DateInput";
  import DeleteDialog from "../../components/common/DeleteDialog";
  import SelectAdvanced from "../../components/common/SelectAdvanced";
  import Table from "../../components/common/Table";
  import Layout from "../../components/Layout";
  import { useToastPromise } from "../../hooks/useToast";
  
  type TaskInputs = {
    description : string;
  };

  type EmployeeInputs = {
    employee: any;
  };

  //TODO ERROR: update or delete on table "pracownicy" violates foreign key constraint "pracownik_zagroda_prac_fk" on table "pracownik_zagroda" usuwanie pracownika musi być kaskadowe

  const EmployeePage = (): React.ReactElement => {
    const router = useRouter();
    const toast = useToastPromise();
    const {
      isOpen: isDeleteOpen,
      onOpen: onDeleteOpen,
      onClose: onDeleteClose,
    } = useDisclosure();
    const {
      isOpen: isTaskOpen,
      onOpen: onTaskOpen,
      onClose: onTaskClose,
    } = useDisclosure();

    const { id } = router.query;
  
    const { data : employee, error } = useSWR(id ? `/employee/${id}` : null);
    const { data : employees } = useSWR("employees");
    const cancelRef = useRef();
  const [typeClicked, setTypeClicked] = useState("");
  const [whichClicked, setWhichClicked] = useState(null);

  const taskMethods = useForm<TaskInputs>();
  const {
    reset: resettask,
    register: registertask,
    handleSubmit: handletaskSubmit,
    control: controltask,
    formState: { errors: taskErrors, isSubmitting: istaskSubmitting },
  } = taskMethods;

  useEffect(() => {
    if (isTaskOpen) {
      resettask({
        description: whichClicked?.description || "",
      });
    }

  }, [whichClicked, isTaskOpen]);

  //TODO przy edycji taska, jest 200, ale task nie zmienia się w bazie

  const ontaskSubmit = (data) => {
    const postData={employee: id , ...data};

    if (whichClicked !== null) {
      return toast.promise(
        axios.put(`/task/${id}+${whichClicked?.description}`, postData).then(() => {
          mutate(`/employee/${id}`);
          onTaskClose();
        })
      );
    } else {
      return toast.promise(
        axios.post(`/tasks`, postData).then(() => {
          mutate(`/employee/${id}`);
          onTaskClose();
        })
      );
    }
  };

  const onDelete = () => {
    if (typeClicked == "employee")
      return toast.promise(
        axios.delete(`/employee/${id}`).then(() => {
          mutate("/employees");
          router.push(`/employees`);
        })
      );

    if (typeClicked == "task") {
      const deleteData = {
        description : whichClicked?.description,
        employee : id
      };
      return toast.promise(
        axios.delete(`/tasks`, {data :deleteData}).then(() => {
          mutate(`/employee/${id}`);
        })
      );
    }
};

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
        .put(`/employee/transfer/${id}+${data?.employee}`)
        .then(() => {
          mutate("/employees");
          mutate(`/employee/${id}`);
          onEmployeeClose();
        })
    );
  };

const tasksColumns = [
    {
      Header: "Opis",
      accessor: "description",
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
            <Icon
              onClick={() => {
                setTypeClicked("task");
                setWhichClicked(row?.original);
                onTaskOpen();
              }}
              as={Edit}
            />
          </Tooltip>
          <Tooltip hasArrow label="Usuń" placement="top">
            <Icon
              as={Trash2}
              color="red.400"
              onClick={() => {
                setTypeClicked("task");
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
    <Modal
        isCentered
        size="4xl"
        isOpen={isTaskOpen}
        onClose={onTaskClose}
        preserveScrollBarGap
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Zadanie</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...taskMethods}>
              <form onSubmit={handletaskSubmit(ontaskSubmit)} noValidate>
                <Flex flexDirection="column" gap={4}>
                <FormControl isInvalid={!!taskErrors.description} isRequired>
                    <FormLabel htmlFor="name">Opis</FormLabel>
                    <Textarea
                      type="string"
                      {...registertask("description", { required: true })}
                    />
                  </FormControl>
                  <Flex justifyContent="flex-end">
                    <Button type="submit" isLoading={istaskSubmitting}>
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
            { label: "Pracownicy", isCurrentPage: false, href: "/employees" },
            {
              label: "Szczegóły pracownika",
              isCurrentPage: true,
              href: `/employee/${id}`,
            },
          ]}
        />
        <Flex justifyContent="flex-end" gap={3}>
          <Button
            variant="outline"
            onClick={() => {
              setTypeClicked("employee");
              onDeleteOpen();
            }}
          >
            Usuń
          </Button>
          <Button onClick={() => router.push(`/employee/form/${id}`)}>
            Edytuj
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid gap={5} columns={2} mb={5}>
        <Text textAlign="end">PESEL: </Text>
        <Text>{employee?.employee?.pesel || "-"}</Text>
        <Text textAlign="end">Imię: </Text>
        <Text>{employee?.employee?.fisrtName || "-"}</Text>
        <Text textAlign="end">Nazwisko: </Text>
        <Text>{employee?.employee?.lastName || "-"}</Text>
        <Text textAlign="end">Data zatrudnienia: </Text>
        <Text>
          {employee?.employee?.dateOfEmployment
            ? format(new Date(employee?.employee?.dateOfEmployment), "dd/MM/yyyy")
            : "-"}
        </Text>
      </SimpleGrid>
      <Divider mb={5} />
      <Flex flexDirection="column">
          <Flex justifyContent="space-between">
            <Text fontSize="xl" fontWeight={700}>
              Zadania
            </Text>
            <Flex gap={3}>
               <Button
              onClick={() => {
                setWhichClicked(null);
                onEmployeeOpen();
              }}
            >
              Przekaż zadania innemu pracownikowi
            </Button>
            <Button
              onClick={() => {
                setWhichClicked(null);
                onTaskOpen();
              }}
            >
              Dodaj zadanie
            </Button> 
            </Flex>
            
          </Flex>

          {employee?.tasks?.length > 0 ? (
            <Table data={employee?.tasks} columns={tasksColumns} />
          ) : (
            <Text>Pracownik nie posiada zadań</Text>
          )}
        </Flex>
    </>)
  };

  EmployeePage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default EmployeePage;