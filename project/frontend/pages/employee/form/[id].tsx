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
  pesel: string;
  fisrtName: string;
  lastName: string;
  dateOfEmployment: Date;
};

const EmployeeFormPage = (): React.ReactElement => {
  const router = useRouter();
  const toast = useToastPromise();
  const { id } = router.query;
  const { data: employee, isValidating, mutate } = useSWR(`/employee/${id}`);

  const methods = useForm<FormInputs>();
  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    if (employee) {
      reset({
        pesel: employee?.employee?.pesel,
        fisrtName: employee?.employee?.fisrtName,
        lastName: employee?.employee?.lastName,
        dateOfEmployment: employee?.employee?.dateOfEmployment
          ? new Date(employee?.employee?.dateOfEmployment)
          : new Date(),
      });
    }
  }, [employee]);
  console.log(errors)

  const onSubmit = (data) => {
    if (id != "0") {
      return toast.promise(
        axios.put(`/employee/${id}`, data).then(() => {
          mutate(`/employee/${id}`);
          mutate("/employees");
          router.push(`/employee/${id}`);
        })
      );
    } else {
      return toast.promise(
        axios.post(`/employees`, data).then(() => {
          mutate(`/employee/${id}`);
          mutate("/employees");
          router.push("/employees");
        })
      );
    }
  };

  return (
    <div style={{ height: "900px" }}>
      <BreadCrumb
        breadcrumb={[
          { label: "Pracownicy", isCurrentPage: false, href: "/employees" },
          {
            label: id != 0 ? "Edytuj pracownika" : "Dodaj pracownika",
            isCurrentPage: true,
            href: `/employee/form/${id}`,
          },
        ]}
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Flex flexDirection="column" gap={3}>
            <FormControl isInvalid={!!errors.pesel} isRequired>
              <FormLabel htmlFor="pesel">PESEL</FormLabel>
              <Input
                type="number"
                {...register("pesel", {
                  required: true,
                  minLength: 11,
                  maxLength: 11,
                  pattern: {
                    value: /([0-9])\w+/,
                  },
                })}
              />
              {errors.pesel && (
                <FormErrorMessage>
                  {errors.pesel && errors.pesel.type === "required" && (
                    <span>Pole wymagane</span>
                  )}
                  {errors.pesel && (errors.pesel.type === "maxLength" || errors.pesel.type === "minLength") && (
                    <span>Pesel musi składać się z 11 znaków</span>
                  )}
                  {errors.pesel && errors.pesel.type === "pattern" && (
                    <span>Pesel musi składać się z samych cyfr</span>
                  )}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.fisrtName} isRequired>
              <FormLabel htmlFor="fisrtName">Imię</FormLabel>
              <Input
                type="string"
                {...register("fisrtName", { required: true })}
              />
              {errors.fisrtName && (
                <FormErrorMessage>Pole wymagane</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.lastName} isRequired>
              <FormLabel htmlFor="lastName">Nazwisko</FormLabel>
              <Input
                type="string"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <FormErrorMessage>Pole wymagane</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.dateOfEmployment} isRequired>
              <FormLabel>Data zatrudnienia</FormLabel>
              <Controller
                control={control}
                name="dateOfEmployment"
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <DateInput ref={ref} selected={value} onChange={onChange} />
                )}
              />
              {errors.dateOfEmployment && (
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

EmployeeFormPage.getLayout = (page: React.ReactElement) => (
  <Layout>{page}</Layout>
);

export default EmployeeFormPage;
