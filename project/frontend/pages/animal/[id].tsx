import {
  Button,
  Divider,
  Flex, FormControl, FormErrorMessage, FormLabel, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, SimpleGrid,
  Spinner,
  Text,
  Textarea,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Edit, Trash2 } from "react-feather";
import { Controller, FormProvider, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import BreadCrumb from "../../components/Breadcrumb";
import DateInput from "../../components/common/DateInput";
import DeleteDialog from "../../components/common/DeleteDialog";
import SelectAdvanced from "../../components/common/SelectAdvanced";
import Table from "../../components/common/Table";
import Layout from "../../components/Layout";
import { useToastPromise } from "../../hooks/useToast";

type ServingInputs = {
  food: string;
  amount: number;
};

type TreatmentInputs = {
  disease: string;
  description: string;
  date: Date;
};

const AnimalPage = (): React.ReactElement => {
  const router = useRouter();
  const toast = useToastPromise();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isServingOpen,
    onOpen: onServingOpen,
    onClose: onServingClose,
  } = useDisclosure();
  const {
    isOpen: isTreatmentOpen,
    onOpen: onTreatmentOpen,
    onClose: onTreatmentClose,
  } = useDisclosure();
  const { id } = router.query;

  const { data, error } = useSWR(id ? `/animal/${id}` : null);

  const { data: employeeData, isValidating: isEmployeeValidating } = useSWR(
    data?.animal?.employee ? `/employee/${data?.animal?.employee}` : null
  );
  const { data: foodData, isValidating } = useSWR(`/food`);
  const cancelRef = useRef();
  const [typeClicked, setTypeClicked] = useState("");
  const [whichClicked, setWhichClicked] = useState(null);

  const foodOptions = foodData?.map((food) => ({
    value: food?.name,
    label: food?.name + " [ " + food?.unit + "]",
  }));

  const servingMethods = useForm<ServingInputs>();
  const {
    reset: resetServing,
    register: registerServing,
    handleSubmit: handleServingSubmit,
    control: controlServing,
    formState: { errors: servingErrors, isSubmitting: isServingSubmitting },
  } = servingMethods;
  const treatmentMethods = useForm<TreatmentInputs>();
  const {
    reset: resetTreatment,
    register: registerTreatment,
    handleSubmit: handleTreatmentSubmit,
    control: controlTreatment,
    formState: { errors: treatmentErrors, isSubmitting: isTreatmentSubmitting },
  } = treatmentMethods;

  useEffect(() => {
    if (isServingOpen) {
      resetServing({
        food: whichClicked?.food || null,
        amount: whichClicked?.amount || null,
      });
    }
    if (isTreatmentOpen) {
      resetTreatment({
        disease: whichClicked?.disease || null,
        description: whichClicked?.description || null,
        date: whichClicked?.date ?  new Date(whichClicked?.date) : new Date(),
      });
    }
  }, [whichClicked, isServingOpen, isTreatmentOpen]);

  const onServingSubmit = (data) => {
    const postData = {
      ...data,
      animal: id,
    }
    if (whichClicked!==null){
      return toast.promise(
        axios.put(`/serving/${id}+${data?.food}`, postData).then(() => {
          mutate(`/animal/${id}`);
          mutate("/servings");
          onServingClose();
        })
      );
    } else {
      return toast.promise(
        axios.post(`/servings`, postData).then(() => {
          mutate(`/animal/${id}`);
          mutate("/servings");
          onServingClose();
        })
      );
    }
  };

  //TODO nie działa edytowanie leczenia
  const onTreatmentSubmit = (data) => {
    const postData = {
      description: data?.description || "-",
      date: data?.date,
      disease: data?.disease,
      animal: id,
    }
    if (whichClicked!==null){
      return toast.promise(
        axios.put(`/serving/${id}+${data?.disease}+${format(new Date(data?.date), "yyyy-MM-dd")}`, postData).then(() => {
          mutate(`/animal/${id}`);
          mutate("/treatments");
          onTreatmentClose();
        })
      );
    } else {
      return toast.promise(
        axios.post(`/treatments`, postData).then(() => {
          mutate(`/animal/${id}`);
          mutate("/treatments");
          onTreatmentClose();
        })
      );
    }
  };

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
      const deleteData = {
        animal: id,
        disease: whichClicked?.disease,
        date: whichClicked?.date,
        description: whichClicked?.description,
      };
      return toast.promise(
        axios.delete(`/treatments`, deleteData).then(() => {
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

  // TODO dodać modal treatment i go obsłużyć

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
            <Icon
              onClick={() => {
                setTypeClicked("serving");
                setWhichClicked(row?.original);
                onServingOpen();
              }}
              as={Edit}
            />
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
        <Text>{ format(date ? new Date(date) : new Date(), "dd/MM/yyyy")}</Text>
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
            <Icon
              onClick={() => {
                setTypeClicked("treatment");
                setWhichClicked(row?.original);
                onTreatmentOpen();
              }}
              as={Edit}
            />
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
<Modal
        isCentered
        size="4xl"
        isOpen={isTreatmentOpen}
        onClose={onTreatmentClose}
        preserveScrollBarGap
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leczenie</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...treatmentMethods}>
              <form onSubmit={handleTreatmentSubmit(onTreatmentSubmit)} noValidate>
                <Flex flexDirection="column" gap={4}>
                  <FormControl isInvalid={!!treatmentErrors.disease} isRequired>
                    <FormLabel htmlFor="name">Choroba</FormLabel>
                    <Input
                      type="string"
                      {...registerTreatment("disease", { required: true })}
                    />
                    {treatmentErrors.disease && (
                      <FormErrorMessage>Pole wymagane</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!treatmentErrors.date} isRequired>
              <FormLabel>Data</FormLabel>
              <Controller
                control={controlTreatment}
                name="date"
                rules={{ required: false }}
                render={({ field: { onChange, value, ref } }) => (
                  <DateInput ref={ref} selected={value} onChange={onChange} />
                )}
              />
              {treatmentErrors.date && (
                <FormErrorMessage>Pole wymagane</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!treatmentErrors.description}>
                    <FormLabel htmlFor="name">Opis</FormLabel>
                    <Textarea
                      type="string"
                      {...registerTreatment("description", { required: false })}
                    />
                  </FormControl>
                  <Flex justifyContent="flex-end">
                    <Button type="submit" isLoading={isServingSubmitting}>
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
        isOpen={isServingOpen}
        onClose={onServingClose}
        preserveScrollBarGap
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Porcja</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...servingMethods}>
              <form onSubmit={handleServingSubmit(onServingSubmit)} noValidate>
                <Flex flexDirection="column" gap={4}>
                  <FormControl isInvalid={!!servingErrors.food} isRequired>
                    <FormLabel htmlFor="name">Jedzenie</FormLabel>
                    <Controller
                      control={controlServing}
                      name="food"
                      rules={{ required: true }}
                      render={({ field: { onChange, value, ref } }) => (
                        <SelectAdvanced
                          inputRef={ref}
                          value={foodOptions?.find((c) => value === c.value)}
                          onChange={(val) => onChange(val.value)}
                          options={foodOptions}
                          isInvalid={!!servingErrors.food}
                          isClearable={false}
                        />
                      )}
                    />
                    {servingErrors.food && (
                      <FormErrorMessage>Pole wymagane</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!servingErrors.amount} isRequired>
                    <FormLabel htmlFor="name">Ilość</FormLabel>
                    <Input
                      type="number"
                      {...registerServing("amount", { required: true })}
                    />
                    {servingErrors.amount && (
                      <FormErrorMessage>Pole wymagane</FormErrorMessage>
                    )}
                  </FormControl>
                  <Flex justifyContent="flex-end">
                    <Button type="submit" isLoading={isServingSubmitting}>
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
            <Button
              onClick={() => {
                setWhichClicked(null);
                onServingOpen();
              }}
            >
              Dodaj porcję
            </Button>
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
            <Button
              onClick={() => {
                setWhichClicked(null);
                onTreatmentOpen();
              }}
            >
              Dodaj leczenie
            </Button>
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
