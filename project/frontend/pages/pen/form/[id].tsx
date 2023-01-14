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
    size: number;
    climate: string;
  };

  const PanFormPage = (): React.ReactElement => {
    const router = useRouter();
    const toast = useToastPromise();
    const { id } = router.query;
    const { data: panData, isValidating, mutate } = useSWR(`/run/${id}`);
    const { data: climatesData } = useSWR(`/climates`);
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
          name: panData?.name?.trim() || "",
          size: panData?.size,
          climate: panData?.climate,
        });
    }, [panData]);

    const climatesOptions = climatesData?.map((climate) => ({
      value: climate?.name,
      label: climate?.name,
    }));

    const onSubmit = (data) => {
      if (id != "0") {
        return toast.promise(
          axios.put(`/run/${id}`, data).then(() => {
            mutate(`/run/${id}`);
            mutate("/runs");
            mutate("/animals");
            router.push(`/pens`);
          })
        );
      } else {
        return toast.promise(
          axios.post(`/runs`, data).then(() => {
            mutate(`/run/${id}`);
            mutate("/runs");
            mutate("/animals");
            router.push("/pens");
          })
        );
      }
    };

    return (
      <div style={{ height: "900px" }}>
        <BreadCrumb
          breadcrumb={[
            { label: "Zagrody", isCurrentPage: false, href: "/pans" },
            {
              label: id!="0" ? "Edytuj zagrodę" : "Dodaj zagrodę",
              isCurrentPage: true,
              href: `/pan/form/${id}`,
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
              <FormControl isInvalid={!!errors.climate} isRequired>
                <Box>
                  <FormLabel htmlFor="type">Klimat</FormLabel>
                  <Controller
                    control={control}
                    name="climate"
                    rules={{ required: true }}
                    render={({ field: { onChange, value, ref } }) => (
                      <SelectAdvanced
                        inputRef={ref}
                        value={climatesOptions?.find((c) => value === c.value)}
                        onChange={(val) => onChange(val.value)}
                        options={climatesOptions}
                        isInvalid={!!errors.climate}
                        isClearable={false}
                      />
                    )}
                  />
                  {errors.climate && (
                    <FormErrorMessage>Pole wymagane</FormErrorMessage>
                  )}
                </Box>
              </FormControl>
              <FormControl isInvalid={!!errors.size} isRequired>
                <Box>
                  <FormLabel htmlFor="type">Rozmiar [a]</FormLabel>
                  <Input type="number" {...register("size", { required: true })} />
                  {errors.size && (
                    <FormErrorMessage>Pole wymagane</FormErrorMessage>
                  )}
                </Box>
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
  
  PanFormPage.getLayout = (page: React.ReactElement) => (
    <Layout>{page}</Layout>
  );

  export default PanFormPage;