import React from "react";
import {
  Box,
  Flex,
  Image,
  Stack,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useState } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const { publicRuntimeConfig } = getConfig();

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { pathname } = router;
  const isActive = (path: string) =>
    pathname === path || (pathname.startsWith(path) && !path.endsWith("/"));
  const [bigLogoRef, bigLogoInView] = useInView();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Flex
        pl={{ base: "10px", sm: "20px", xl: "20px" }}
        pt="5px"
        ref={bigLogoRef}
      >
        <Flex justifyContent="space-between" width="100%">
          <Image
            src={`${publicRuntimeConfig.basePath}/logo.png`}
            alt="Logo"
            w="150px"
            onClick={() => router.push("/")}
            cursor="pointer"
          />
          <Flex justifySelf="end">
            {/* TODO uruchomienie trybu kontrastowego */}
            {/* <Button onClick={toggleColorMode} mr={10} alignSelf="center">
            {colorMode === "light" ? "włącz" : "wyłącz"} tryb kontrastowy
          </Button> */}
          </Flex>
        </Flex>
      </Flex>
      <Flex
        justify={"center"}
        align="center"
        bg="green.600"
        pl={{ base: "15px", sm: "50px", xl: "100px" }}
        pr={{ base: "15px", sm: "50px", xl: "100px" }}
        position="sticky"
        top={0}
        left={0}
        right={0}
        zIndex={1001}
        minH={{ base: "66px", sm: "55px" }}
      >
        <Flex align="center">
          <Image
            position="absolute"
            left={10}
            style={{ visibility: bigLogoInView ? "hidden" : "visible" }}
            alignSelf="flex-start"
            src={`${publicRuntimeConfig.basePath}/logo.png`}
            alt="GovLogo"
            w="100px"
          />
          <Stack direction="row" mr="50px">
            <Link href="/" passHref legacyBehavior>
              <Box
                as="a"
                role="group"
                color="white"
                textTransform="uppercase"
                letterSpacing="1px"
                px="15px"
              >
                Pulpit
                <Box
                  h="3px"
                  borderRadius="3px"
                  mx="auto"
                  mt="3px"
                  bg="white"
                  opacity={isActive("/") ? 0.5 : 0}
                  w={isActive("/") ? "100%" : "1px"}
                  transition="all .25s ease-in-out"
                  _groupHover={{ opacity: 1.0, w: "100%" }}
                ></Box>
              </Box>
            </Link>
            <Link href="/animals" passHref legacyBehavior>
              <Box
                as="a"
                role="group"
                color="white"
                textTransform="uppercase"
                letterSpacing="1px"
                px="15px"
              >
                Zwierzęta
                <Box
                  h="3px"
                  borderRadius="3px"
                  mx="auto"
                  mt="3px"
                  bg="white"
                  opacity={isActive("/animals") ? 0.5 : 0}
                  w={isActive("/animals") ? "100%" : "1px"}
                  transition="all .25s ease-in-out"
                  _groupHover={{ opacity: 1.0, w: "100%" }}
                ></Box>
              </Box>
            </Link>
            <Link href="/employees" passHref legacyBehavior>
              <Box
                as="a"
                role="group"
                color="white"
                textTransform="uppercase"
                letterSpacing="1px"
                px="15px"
              >
                Pracownicy
                <Box
                  h="3px"
                  borderRadius="3px"
                  mx="auto"
                  mt="3px"
                  bg="white"
                  opacity={isActive("/employees") ? 0.5 : 0}
                  w={isActive("/employees") ? "100%" : "1px"}
                  transition="all .25s ease-in-out"
                  _groupHover={{ opacity: 1.0, w: "100%" }}
                ></Box>
              </Box>
            </Link>
            <Link href="/pens" passHref legacyBehavior>
              <Box
                as="a"
                role="group"
                color="white"
                textTransform="uppercase"
                letterSpacing="1px"
                px="15px"
              >
                zagrody
                <Box
                  h="3px"
                  borderRadius="3px"
                  mx="auto"
                  mt="3px"
                  bg="white"
                  opacity={isActive("/pens") ? 0.5 : 0}
                  w={isActive("/pens") ? "100%" : "1px"}
                  transition="all .25s ease-in-out"
                  _groupHover={{ opacity: 1.0, w: "100%" }}
                ></Box>
              </Box>
            </Link>
            <Link href="/climates" passHref legacyBehavior>
              <Box
                as="a"
                role="group"
                color="white"
                textTransform="uppercase"
                letterSpacing="1px"
                px="15px"
              >
                Klimaty
                <Box
                  h="3px"
                  borderRadius="3px"
                  mx="auto"
                  mt="3px"
                  bg="white"
                  opacity={isActive("/climates") ? 0.5 : 0}
                  w={isActive("/climates") ? "100%" : "1px"}
                  transition="all .25s ease-in-out"
                  _groupHover={{ opacity: 1.0, w: "100%" }}
                ></Box>
              </Box>
            </Link>
            <Link href="/foods" passHref legacyBehavior>
              <Box
                as="a"
                role="group"
                color="white"
                textTransform="uppercase"
                letterSpacing="1px"
                px="15px"
              >
                Jedzenie
                <Box
                  h="3px"
                  borderRadius="3px"
                  mx="auto"
                  mt="3px"
                  bg="white"
                  opacity={isActive("/foods") ? 0.5 : 0}
                  w={isActive("/foods") ? "100%" : "1px"}
                  transition="all .25s ease-in-out"
                  _groupHover={{ opacity: 1.0, w: "100%" }}
                ></Box>
              </Box>
            </Link>
            <Link href="/species" passHref legacyBehavior>
              <Box
                as="a"
                role="group"
                color="white"
                textTransform="uppercase"
                letterSpacing="1px"
                px="15px"
              >
                gatunki
                <Box
                  h="3px"
                  borderRadius="3px"
                  mx="auto"
                  mt="3px"
                  bg="white"
                  opacity={isActive("/species") ? 0.5 : 0}
                  w={isActive("/species") ? "100%" : "1px"}
                  transition="all .25s ease-in-out"
                  _groupHover={{ opacity: 1.0, w: "100%" }}
                ></Box>
              </Box>
            </Link>
            <Link href="/teams" passHref legacyBehavior>
              <Box
                as="a"
                role="group"
                color="white"
                textTransform="uppercase"
                letterSpacing="1px"
                px="15px"
              >
                Zespoły
                <Box
                  h="3px"
                  borderRadius="3px"
                  mx="auto"
                  mt="3px"
                  bg="white"
                  opacity={isActive("/teams") ? 0.5 : 0}
                  w={isActive("/teams") ? "100%" : "1px"}
                  transition="all .25s ease-in-out"
                  _groupHover={{ opacity: 1.0, w: "100%" }}
                ></Box>
              </Box>
            </Link>
          </Stack>
        </Flex>
      </Flex>
      <Box p={{ base: "10px 10px", sm: "50px", xl: "50px" }}>{children}</Box>
    </>
  );
};

export default Layout;
