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
  type: string;
};

const ClimateFormPage = (): React.ReactElement => {
  const router = useRouter();
  const toast = useToastPromise();
  const { id } = router.query;
  const { data: teamData, isValidating, mutate } = useSWR(`/team/${id}`);

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
      name: teamData?.name?.trim() || "",
      type: teamData?.type?.trim() || "",
    });
  }, [teamData]);

  const onSubmit = (data) => {
    if (id != "0") {
      return toast.promise(
        axios.put(`/team/${id}`, data).then(() => {
          mutate(`/team/${id}`);
          mutate("/teams");
          router.push(`/teams`);
        })
      );
    } else {
      return toast.promise(
        axios.post(`/teams`, data).then(() => {
          mutate(`/team/${id}`);
          mutate("/teams");
          router.push("/teams");
        })
      );
    }
  };

  return (
    <div style={{ height: "900px" }}>
      <BreadCrumb
        breadcrumb={[
          { label: "Zespoły", isCurrentPage: false, href: "/teams" },
          {
            label: id != "0" ? "Edytuj zespół" : "Dodaj zespół",
            isCurrentPage: true,
            href: `/team/form/${id}`,
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

ClimateFormPage.getLayout = (page: React.ReactElement) => (
  <Layout>{page}</Layout>
);

export default ClimateFormPage;
