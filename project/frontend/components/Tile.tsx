import {Box, Flex, Text} from "@chakra-ui/react";
import Link from "next/link";

const Tile = ({text, href}: {text: string, href: string}) => {
    return (
        <Link href={href} passHref legacyBehavior>
        
        <Box borderRadius={5} bg="green.400" w={250} h={250} m={2} cursor="pointer"
        _hover={{ bg: "green.500" }}>
            <Flex justifyContent="center" minW={250} h={250} alignContent="center" alignItems="center">
                <Text fontSize={25} textAlign="center" color="white">
                    {text}
                </Text>
            </Flex>

        </Box>
        </Link>
    )
}

export default Tile;