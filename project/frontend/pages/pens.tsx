import {
    Button, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalHeader, ModalOverlay, SimpleGrid, Tab,
    TabList,
    TabPanel,
    TabPanels, Tabs, Text, Tooltip, useDisclosure
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Edit, MoreHorizontal, Trash2 } from "react-feather";
import useSWR, { mutate } from "swr";
import BreadCrumb from "../components/Breadcrumb";
import DeleteDialog from "../components/common/DeleteDialog";
import Table from "../components/common/Table";
import Layout from "../components/Layout";
import { useToastPromise } from "../hooks/useToast";
import SelectAdvanced from "../components/common/SelectAdvanced";
import { Controller, FormProvider, useForm } from "react-hook-form";
import axios from "axios";


  
  const PensPage = (): React.ReactElement => {
    const router = useRouter();
    const { data: pens, error } = useSWR("/runs");
    const [idClicked,setIdClicked] = useState(null);
    const {
      isOpen: isDeleteOpen,
      onOpen: onDeleteOpen,
      onClose: onDeleteClose,
    } = useDisclosure();
    const toast = useToastPromise();
    const cancelRef = useRef();
    const [typeClicked, setTypeClicked] = useState("");
    const [whichClicked, setWhichClicked] = useState(null);



  //TODO usuwanie zagrody jest przy użyciu id, ale nie znamy id zagrody, bo nie jest zwracane z get runs??????
    const onDelete = () => {
        console.log("deletings");
        console.log(typeClicked);
     if (typeClicked == "pen") {
        return toast.promise(
            axios.delete(`/run/${idClicked}`).then(() => {
              mutate("/runs");
              mutate("/animals");
              mutate("/employees");
              router.push(`/`);
            })
          );
     } if (typeClicked == "animal") {
        return toast.promise(
            axios.delete(`/animal/${idClicked}`).then(() => {
                mutate("/runs");
                mutate("/animals");
                onDeleteClose();
            })
          );
     } if (typeClicked == "employee") {
        return toast.promise(
            axios.delete(`/employee/${idClicked}`).then(() => {
                mutate("/runs");
                mutate("/employees");
                onDeleteClose();
            })
          );
     }
    };
  
    const animalsColumns = [
      {
        Header: "Imię",
        accessor: "name",
      },
      {
        Header: "Gatunek",
        accessor: "species",
      },
      {
        id: "edit",
        accessor: ({ id }) => (
          <Flex
            width="100%"
            justifyContent="flex-end"
            fontSize="18px"
            lineHeight={1}
            gap={2}
          >
            <Tooltip hasArrow label="Edytuj" placement="top">
              <Link href={`/animals/form/${id}`}>
                <Icon as={Edit} />
              </Link>
            </Tooltip>
            <Tooltip hasArrow label="Usuń" placement="top">
              <Icon
                as={Trash2}
                color="red.400"
                onClick={() => {
                    setTypeClicked("animal");
                  setIdClicked(id);
                onDeleteOpen();
              }}
              />
            </Tooltip>
            <Tooltip hasArrow label="Szczegóły" placement="top">
              <Link href={`/animal/${id}`}>
                <Icon as={MoreHorizontal} />
              </Link>
            </Tooltip>
          </Flex>
        ),
      },
    ];

    const employeesColumns = [
        {
          Header: "Imię",
          accessor: "name",
        },
        {
          Header: "Nazwisko",
          accessor: ({ species }) => <Text>{species}</Text>,
        },
        {
          id: "edit",
          accessor: ({ pesel }) => (
            <Flex
              width="100%"
              justifyContent="flex-end"
              fontSize="18px"
              lineHeight={1}
              gap={2}
            >
              <Tooltip hasArrow label="Edytuj" placement="top">
                <Link href={`/employee/form/${pesel}`}>
                  <Icon as={Edit} />
                </Link>
              </Tooltip>
              <Tooltip hasArrow label="Usuń" placement="top">
                <Icon
                  as={Trash2}
                  color="red.400"
                  onClick={() => {
                    setTypeClicked("employee");
                    setIdClicked(pesel);
                  onDeleteOpen();
                }}
                />
              </Tooltip>
              <Tooltip hasArrow label="Szczegóły" placement="top">
                <Link href={`/employee/${pesel}`}>
                  <Icon as={MoreHorizontal} />
                </Link>
              </Tooltip>
            </Flex>
          ),
        },
      ];

      console.log(pens);
  
   
  
    return (
      <>
      <DeleteDialog
          isOpen={isDeleteOpen}
          cancelRef={cancelRef}
          onClose={onDeleteClose}
          onDelete={onDelete}
        />
        <Flex justifyContent="space-between">
          <BreadCrumb
            breadcrumb={[
              { label: "Zagrody", isCurrentPage: true, href: "/pens" },
            ]}
          />
          <Button onClick={() => router.push("/pen/form/0")}>
            Dodaj zagrodę
          </Button>
        </Flex>
        {pens?.length > 0 && (
            <Tabs>
            <TabList>
                {pens?.map((pen, index) => 
                    <Tab key={index} onClick={()=> setIdClicked(pen?.id)}>{pen?.name}</Tab>
                    )}
            </TabList>
          
            <TabPanels>
            {pens?.map((pen, index) => 
                    <TabPanel key={index}>
                        <Flex justifyContent="flex-end" gap={3}>
                            <Button variant="outline" onClick={()=> {
                                setTypeClicked("pen");
                                setIdClicked(pen?.name);
                                onDeleteOpen();
                            }}>Usuń</Button>
                          <Button>Edytuj</Button>
                          
                        </Flex>
                        
                        <SimpleGrid gap={5} columns={2} mb={5}>
        <Text textAlign="end">Klimat: </Text>
        <Text>{pen?.climate || "-"}</Text>
        <Text textAlign="end">Rozmiar: </Text>
        <Text>{pen?.size || "-"}</Text>
        
      </SimpleGrid>
      <Divider mb={5} />
      <SimpleGrid columns={2} gap={7}>
        <Flex flexDirection="column">
          <Flex justifyContent="space-between">
            <Text fontSize="xl" fontWeight={700}>
              Zwierzęta
            </Text>
            <Button
              onClick={() => {
                router?.push("/animals/form/0")
              }}
            >
              Dodaj zwierzę
            </Button>
          </Flex>

          {pen?.animals?.length > 0 ? (
            <Table data={pen?.animals} columns={animalsColumns} />
          ) : (
            <Text>W tej zagrodzie nie znajduje się żadne zwierzę</Text>
          )}
        </Flex>
        <Flex flexDirection="column">
          <Flex justifyContent="space-between">
            <Text fontSize="xl" fontWeight={700}>
              Pracownicy
            </Text>
            <Button
              onClick={() => {
                router?.push("/employee/form/0")
              }}
            >
              Dodaj pracownika
            </Button>
          </Flex>
          {pen?.employees?.length > 0 ? (
            <Table data={pen?.employees} columns={employeesColumns} />
          ) : (
            <Text>Do tej zagrody nie został przydzielony żaden pracownik</Text>
          )}
        </Flex>
      </SimpleGrid>
                  </TabPanel>
                    )}
            </TabPanels>
          </Tabs>
        //   <Table data={animalsList} columns={columns} searchBar={false} />
        )}
      </>
    );
  };
  
  PensPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
  
  export default PensPage;
  