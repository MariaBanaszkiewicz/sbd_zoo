import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import BreadCrumb from "../../../components/Breadcrumb";
import DateInput from "../../../components/common/DateInput";
import SelectAdvanced from "../../../components/common/SelectAdvanced";
import Layout from "../../../components/Layout";
import { useToastPromise } from "../../../hooks/useToast";

type FormInputs = {
  name: string;
  species: string;
  run: string;
  employee: string;
  birthDate: Date;
  zooDate: Date;
};

const AnimalFormPage = (): React.ReactElement => {
  const router = useRouter();
  const toast = useToastPromise();
  const { id } = router.query;
  const { data: animalData, isValidating, mutate } = useSWR(`/animal/${id}`);
  const { data: speciesData } = useSWR(`/species`);
  const { data: employeeData } = useSWR(`/employees`);
  const { data: runData } = useSWR(`/runs`);

  //TODO JSON parse error: Cannot deserialize value of type `java.lang.Integer` from String "11111111111": Overflow: numeric value (11111111111) out of range of `java.lang.Integer` (-2147483648 -2147483647)] - gdy chcę dodać zwierzę, a jego opiekun ma mieć pesel prawidłowy

  const methods = useForm<FormInputs>();
  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  

  const speciesOptions = speciesData?.map((specie) => ({
    value: specie?.name,
    label: specie?.name,
  }));

  const employeeOptions = employeeData?.map((employee) => ({
    value: employee?.pesel,
    label: employee?.fisrtName + " " + employee?.lastName,
  }));

  const runOptions = runData?.map((run) => ({
    value: run?.name,
    label: run?.name,
  }));
  
  useEffect(() => {
      reset({
        name: animalData?.animal?.name?.trim() || "",
        species: animalData?.animal?.species || "",
        run: animalData?.animal?.run?.trim() || "",
        employee: animalData?.animal?.employee,
        birthDate: animalData?.animal?.birthDate ? new Date(animalData?.animal?.birthDate) : new Date(),
        zooDate: animalData?.animal?.zooDate ? new Date(animalData?.animal?.zooDate) : new Date(),
      });
  }, [animalData,employeeOptions]);


  const onSubmit = (data) => {
    if (id != "0") {
      const putData = { id: id, ...data };
      return toast.promise(
        axios.put(`/animal/${id}`, putData).then(() => {
          mutate(`/animal/${id}`);
          mutate("/animals");
          router.push(`/animal/${id}`);
        })
      );
    } else {
      return toast.promise(
        axios.post(`/animals`, data).then(() => {
          mutate(`/animal/${id}`);
          mutate("/animals");
          router.push("/animals");
        })
      );
    }
  };

  return (
    <div style={{ height: "900px" }}>
      <BreadCrumb
        breadcrumb={[
          { label: "Zwierzęta", isCurrentPage: false, href: "/animals" },
          {
            label: id!=0 ? "Edytuj zwierzę" : "Dodaj zwierzę",
            isCurrentPage: true,
            href: `/animals/form/${id}`,
          },
        ]}
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Flex flexDirection="column" gap={3}>
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel htmlFor="name">Imię</FormLabel>
              <Input type="string" {...register("name", { required: true })} />
              {errors.name && (
                <FormErrorMessage>Pole wymagane</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.species} isRequired>
              <Box>
                <FormLabel htmlFor="type">Gatunek</FormLabel>
                <Controller
                  control={control}
                  name="species"
                  rules={{ required: true }}
                  render={({ field: { onChange, value, ref } }) => (
                    <SelectAdvanced
                      inputRef={ref}
                      value={speciesOptions?.find((c) => value === c.value)}
                      onChange={(val) => onChange(val.value)}
                      options={speciesOptions}
                      isInvalid={!!errors.species}
                      isClearable={false}
                    />
                  )}
                />
                {errors.species && (
                  <FormErrorMessage>Pole wymagane</FormErrorMessage>
                )}
              </Box>
            </FormControl>
            <FormControl isInvalid={!!errors.run} isRequired>
              <Box>
                <FormLabel htmlFor="type">Zagroda</FormLabel>
                <Controller
                  control={control}
                  name="run"
                  rules={{ required: true }}
                  render={({ field: { onChange, value, ref } }) => (
                    <SelectAdvanced
                      inputRef={ref}
                      value={runOptions?.find((c) => value === c.value)}
                      onChange={(val) => onChange(val.value)}
                      options={runOptions}
                      isInvalid={!!errors.run}
                      isClearable={false}
                    />
                  )}
                />
                {errors.run && (
                  <FormErrorMessage>Pole wymagane</FormErrorMessage>
                )}
              </Box>
            </FormControl>{" "}
            <FormControl isInvalid={!!errors.employee} isRequired>
              <Box>
                <FormLabel htmlFor="type">Pracownik</FormLabel>
                <Controller
                  control={control}
                  name="employee"
                  rules={{ required: true }}
                  render={({ field: { onChange, value, ref } }) => (
                    <SelectAdvanced
                      inputRef={ref}
                      value={employeeOptions?.find((c) => value === c.value)}
                      onChange={(val) => onChange(val.value)}
                      options={employeeOptions}
                      isInvalid={!!errors.employee}
                      isClearable={false}
                    />
                  )}
                />
                {errors.employee && (
                  <FormErrorMessage>Pole wymagane</FormErrorMessage>
                )}
              </Box>
            </FormControl>
            <FormControl isInvalid={!!errors.birthDate}>
              <FormLabel>Data urodzenia</FormLabel>
              <Controller
                control={control}
                name="birthDate"
                rules={{ required: false }}
                render={({ field: { onChange, value, ref } }) => (
                  <DateInput ref={ref} selected={value} onChange={onChange} />
                )}
              />
              {errors.birthDate && (
                <FormErrorMessage>Pole wymagane</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.zooDate}>
              <FormLabel>Data przybycia do ZOO</FormLabel>
              <Controller
                control={control}
                name="zooDate"
                rules={{ required: false }}
                render={({ field: { onChange, value, ref } }) => (
                  <DateInput ref={ref} selected={value} onChange={onChange} />
                )}
              />
              {errors.zooDate && (
                <FormErrorMessage>Pole wymagane</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
          <Flex justifyContent="flex-end">
            <Button type="submit" isLoading={isSubmitting}>
              Zapisz
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </div>
  );
};

AnimalFormPage.getLayout = (page: React.ReactElement) => (
  <Layout>{page}</Layout>
);

export default AnimalFormPage;
