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

type ClimateInputs = {
  name: string;
};

const Specie = (): React.ReactElement => {
  const router = useRouter();
  const toast = useToastPromise();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isClimateOpen,
    onOpen: onClimateOpen,
    onClose: onClimateClose,
  } = useDisclosure();

  const { id } = router.query;

  const { data: specieData, error } = useSWR(id ? `/species/${id}` : null);
  const { data: climates } = useSWR("climates");
  const cancelRef = useRef();
  const [typeClicked, setTypeClicked] = useState("");
  const [whichClicked, setWhichClicked] = useState(null);

  const ClimateMethods = useForm<ClimateInputs>();
  const {
    handleSubmit: handleClimateSubmit,
    control: controlClimate,
    formState: { errors: ClimateErrors, isSubmitting: isClimateSubmitting },
  } = ClimateMethods;

  const onclimateSubmit = (data) => {
    const postData = { species: id, climate: data?.name };
    return toast.promise(
      axios.post(`/speciesClimates`, postData).then(() => {
        mutate(`/species/${id}`);
        mutate(`/species`);
        onClimateClose();
      })
    );
  };

  const climateOptions = climates?.map((climate) => ({
    value: climate?.name,
    label: climate?.name,
  }));

  const onDelete = () => {
    if (typeClicked == "specie")
      return toast.promise(
        axios.delete(`/specie/${id}`).then(() => {
          mutate("/species");
          router.push(`/species`);
        })
      );

    if (typeClicked == "climate") {
      const deleteData = {
        climate: whichClicked?.name,
        species: id,
      };
      return toast.promise(
        axios.delete(`/speciesClimates`, { data: deleteData }).then(() => {
          mutate(`/species/${id}`);
        })
      );
    }
  };

  const climatesList = specieData?.climates?.map((climate) => ({
    name: climate,
  }));

  const climateColumns = [
    {
      Header: "Nazwa",
      accessor: "name",
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
                setTypeClicked("climate");
                setWhichClicked(row?.original);
                onClimateOpen();
              }}
              as={Edit}
            />
          </Tooltip>
          <Tooltip hasArrow label="Usuń" placement="top">
            <Icon
              as={Trash2}
              color="red.400"
              onClick={() => {
                setTypeClicked("climate");
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
        isOpen={isClimateOpen}
        onClose={onClimateClose}
        preserveScrollBarGap
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj klimat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...ClimateMethods}>
              <form onSubmit={handleClimateSubmit(onclimateSubmit)} noValidate>
                <Flex flexDirection="column" gap={4}>
                  <FormControl isInvalid={!!ClimateErrors.name} isRequired>
                    <FormLabel htmlFor="name">Klimat</FormLabel>
                    <Controller
                      control={controlClimate}
                      name="name"
                      rules={{ required: true }}
                      render={({ field: { onChange, value, ref } }) => (
                        <SelectAdvanced
                          inputRef={ref}
                          value={climateOptions?.find((c) => value === c.value)}
                          onChange={(val) => onChange(val.value)}
                          options={climateOptions}
                          isInvalid={!!ClimateErrors.name}
                          isClearable={false}
                        />
                      )}
                    />
                    {ClimateErrors.name && (
                      <FormErrorMessage>Pole wymagane</FormErrorMessage>
                    )}
                  </FormControl>

                  <Flex justifyContent="flex-end">
                    <Button type="submit" isLoading={isClimateSubmitting}>
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
            { label: "Gatunki", isCurrentPage: false, href: `/species` },
            {
              label: "Szczegóły gatunku",
              isCurrentPage: true,
              href: `/specie/${id}`,
            },
          ]}
        />
        <Flex justifyContent="flex-end" gap={3}>
          <Button
            variant="outline"
            onClick={() => {
              setTypeClicked("specie");
              onDeleteOpen();
            }}
          >
            Usuń
          </Button>
          <Button onClick={() => router.push(`/specie/form/${id}`)}>
            Edytuj
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid gap={5} columns={2} mb={5}>
        <Text textAlign="end">Nazwa: </Text>
        <Text>{specieData?.name || "-"}</Text>
        <Text textAlign="end">Gromada: </Text>
        <Text>{specieData?.theClass || "-"}</Text>
      </SimpleGrid>
      <Divider mb={5} />
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Text fontSize="xl" fontWeight={700}>
            Klimaty odpowiednie dla gatunku
          </Text>
          <Flex gap={3}>
            <Button
              onClick={() => {
                setWhichClicked(null);
                onClimateOpen();
              }}
            >
              Dodaj klimat
            </Button>
          </Flex>
        </Flex>

        {climatesList?.length > 0 ? (
          <Table data={climatesList} columns={climateColumns} />
        ) : (
          <Text>Brak klimatów odpowiednich dla tego gatunku</Text>
        )}
      </Flex>
    </>
  );
};

Specie.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Specie;
