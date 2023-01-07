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
    unit: string;
    type: string;
  };

  const FoodFormPage = (): React.ReactElement => {
    const router = useRouter();
    const toast = useToastPromise();
    const { id } = router.query;
    const { data: foodData, isValidating, mutate } = useSWR(`/food/${id}`);

    const methods = useForm<FormInputs>();
    const {
      reset,
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting },
    } = methods;
  
    useEffect(() => {
        reset({
          name: foodData?.name?.trim() || "",
          unit: foodData?.unit?.trim() || "",
          type: foodData?.type?.trim() || "",
        });
    }, [foodData]);

    const onSubmit = (data) => {
        if (id != "0") {
          return toast.promise(
            axios.put(`/food/${id}`, data).then(() => {
              mutate(`/food/${id}`);
              mutate("/food");

              router.push(`/foods`);
            })
          );
        } else {
          return toast.promise(
            axios.post(`/food`, data).then(() => {
              mutate(`/food/${id}`);
              mutate("/food");
              router.push("/foods");
            })
          );
        }
      };

      return (
        <div style={{ height: "900px" }}>
          <BreadCrumb
            breadcrumb={[
              { label: "Jedzenie", isCurrentPage: false, href: "/foods" },
              {
                label: id!="0" ? "Edytuj jedzenie" : "Dodaj jedzenie",
                isCurrentPage: true,
                href: `/food/form/${id}`,
              },
            ]}
          />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Flex flexDirection="column" gap={3}>
                <FormControl isInvalid={!!errors.name} isRequired>
                  <FormLabel htmlFor="name">Nazwa</FormLabel>
                  <Input type="string" {...register("name", { required: true })} />
                  {errors.name && (
                    <FormErrorMessage>Pole wymagane</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.unit} isRequired>
                  <FormLabel htmlFor="unit">Jednostka</FormLabel>
                  <Input type="string" {...register("unit", { required: true })} />
                  {errors.unit && (
                    <FormErrorMessage>Pole wymagane</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.type} isRequired>
                  <FormLabel htmlFor="type">Typ</FormLabel>
                  <Input type="string" {...register("type", { required: true })} />
                  {errors.type && (
                    <FormErrorMessage>Pole wymagane</FormErrorMessage>
                  )}
                </FormControl>

                </Flex>
            <Flex justifyContent="flex-end">
              <Button type="submit" isLoading={isSubmitting} mt={3}>
                Zapisz
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </div>
    );
  };

  FoodFormPage.getLayout = (page: React.ReactElement) => (
    <Layout>{page}</Layout>
  );

  export default FoodFormPage;