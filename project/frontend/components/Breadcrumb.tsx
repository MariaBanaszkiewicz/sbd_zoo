
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Icon
} from "@chakra-ui/react";
import {
    ChevronRight
} from "react-feather";
import Link from "next/link";

  type BreadcrumbItem = {
    label: string;
    isCurrentPage?: boolean;
    href?: string;
  };

const BreadCrumb = ({breadcrumb}: {breadcrumb : BreadcrumbItem[]}) => {

return(

    <Breadcrumb
      spacing="5px"
      separator={
        <Flex align="center">
          <Icon as={ChevronRight} color="gray.400" w="20px" h="20px" />
        </Flex>
      }
      mb="20px"
    >
      {breadcrumb.map((item, index) => (
        <BreadcrumbItem
          isCurrentPage={item.isCurrentPage}
          key={`breadcrumb-${index}`}
        >
          {item.href ? (
            <Link href={item.href} passHref legacyBehavior>
              <BreadcrumbLink>{item.label}</BreadcrumbLink>
            </Link>
          ) : (
            <BreadcrumbLink isCurrentPage>{item.label}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>)
}

export default BreadCrumb;