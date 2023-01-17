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
    theClass: string;
  };

  const SpecieFormPage = (): React.ReactElement => {
    const router = useRouter();
    const toast = useToastPromise();
    const { id } = router.query;
    const { data: specieData, isValidating, mutate } = useSWR(`/species/${id}`);

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
          name: specieData?.name?.trim() || "",
          theClass: specieData?.theClass?.trim() || "",
        });
    }, [specieData]);

    const onSubmit = (data) => {
        if (id != "0") {
          return toast.promise(
            axios.put(`/species/${id}`, data).then(() => {
              mutate(`/species/${id}`);
              mutate("/species");
              mutate("animals");
              router.push(`/species`);
            })
          );
        } else {
          return toast.promise(
            axios.post(`/species`, data).then(() => {
              mutate(`/species/${id}`);
              mutate("/species");
              mutate("animals");
              router.push("/species");
            })
          );
        }
      };

      return (
        <div style={{ height: "900px" }}>
          <BreadCrumb
            breadcrumb={[
              { label: "Gatunki", isCurrentPage: false, href: `/species` },
              {
                label: id!="0" ? "Edytuj gatunek" : "Dodaj gatunek",
                isCurrentPage: true,
                href: `/specie/form/${id}`,
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
                <FormControl isInvalid={!!errors.theClass} isRequired>
                  <FormLabel htmlFor="theClass">Gromada</FormLabel>
                  <Input type="string" {...register("theClass", { required: true })} />
                  {errors.theClass && (
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

  SpecieFormPage.getLayout = (page: React.ReactElement) => (
    <Layout>{page}</Layout>
  );

  export default SpecieFormPage;