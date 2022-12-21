import { Flex, Icon, Tooltip } from "@chakra-ui/react";
import React from "react";
import { Edit, Trash2 } from "react-feather";
import Link from "next/link";

const ToolBox = ({editPath}: {editPath:string}): React.ReactElement => (
    <Flex width="100%" justifyContent="flex-end" fontSize="18px" lineHeight={1}>
        <Tooltip hasArrow label="Edytuj" placement="top">
          <Link href={editPath}>
            <Icon as={Edit} />
          </Link>
        </Tooltip>
        <Tooltip hasArrow label="Usuń" placement="top">
          <Link href={editPath}>
            <Icon as={Trash2} onClick={() => console.log("delete")}/>
          </Link>
        </Tooltip>
      </Flex>
)

export default ToolBox;