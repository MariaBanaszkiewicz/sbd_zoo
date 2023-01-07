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
    flora: string;
    temperatur: number;
    humidity: number;
  };

  const ClimateFormPage = (): React.ReactElement => {
    const router = useRouter();
    const toast = useToastPromise();
    const { id } = router.query;
    const { data: climateData, isValidating, mutate } = useSWR(`/climate/${id}`);

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
          name: climateData?.name?.trim() || "",
          flora: climateData?.flora?.trim() || "",
          temperatur: climateData?.temperatur,
          humidity: climateData?.humidity,
        });
    }, [climateData]);

    const onSubmit = (data) => {
        const postData = {
            name: data?.name,
            temperatur: data?.temperatur || 9999,
            flora: data?.flora || "-",
            humidity: data?.humidity || 9999,
        }
        if (id != "0") {
          return toast.promise(
            axios.put(`/climate/${id}`, postData).then(() => {
              mutate(`/climate/${id}`);
              mutate("/climates");
              mutate("animals");
              mutate("runs");
              router.push(`/climates`);
            })
          );
        } else {
          return toast.promise(
            axios.post(`/climates`, postData).then(() => {
              mutate(`/climate/${id}`);
              mutate("/climates");
              mutate("animals");
              mutate("runs");
              router.push("/climates");
            })
          );
        }
      };

      return (
        <div style={{ height: "900px" }}>
          <BreadCrumb
            breadcrumb={[
              { label: "Klimaty", isCurrentPage: false, href: "/climates" },
              {
                label: id!="0" ? "Edytuj klimat" : "Dodaj klimat",
                isCurrentPage: true,
                href: `/climate/form/${id}`,
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
                <FormControl isInvalid={!!errors.flora} isRequired>
                  <FormLabel htmlFor="flora">Roślinność</FormLabel>
                  <Input type="string" {...register("flora", { required: true })} />
                </FormControl>
                <FormControl isInvalid={!!errors.temperatur} isRequired>
                  <FormLabel htmlFor="temperatur">Średnia temperatura dobowa [C]</FormLabel>
                  <Input type="string" {...register("temperatur", { required: true })} />
                </FormControl>
                <FormControl isInvalid={!!errors.humidity} isRequired>
                  <FormLabel htmlFor="humidity">Wilgotność powietrza</FormLabel>
                  <Input type="string" {...register("humidity", { required: true })} />
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

  ClimateFormPage.getLayout = (page: React.ReactElement) => (
    <Layout>{page}</Layout>
  );

  export default ClimateFormPage;