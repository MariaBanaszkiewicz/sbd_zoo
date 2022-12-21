import { Flex, IconButton } from "@chakra-ui/react";
import styled from "@emotion/styled";
import * as React from "react";
import {
  color,
  layout,
  ColorProps,
  justifyContent,
  JustifyContentProps,
  space,
  SpaceProps,
} from "styled-system";

export const StyledTable = styled.div<SpaceProps>`
  ${space};
  display: table;
  box-sizing: border-box;
  border-top-width: 1px;
  min-width: 100%;
`;

export const TableHead = styled.div<SpaceProps>`
  ${space};
  display: table-row-group;
`;

export const TableCell = styled<
  "div",
  SpaceProps & ColorProps & JustifyContentProps
>("div", {})`
  ${space};
  ${color};
  ${layout};
  ${justifyContent};
  display: table-cell;
  border-bottom-width: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  line-height: 1.4;
  vertical-align: middle;
`;

export const TableRow = styled(Flex)`
  &:nth-child(even) {
    background-color: #f5f5f5;
  }
  &:hover {
    cursor: pointer;
    background-color: #e9e9e9;
  }
`;

type TableIconButtonProps = SpaceProps & {
  icon: any;
  onClick:
    | ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void)
    | undefined;
  isDisabled: boolean;
};

export const TableIconButton: React.FC<TableIconButtonProps> = ({
  icon,
  onClick,
  isDisabled,
  children,
  ...rest
}) => {
  return (
    <IconButton
      variant="ghost"
      {...rest}
      icon={icon}
      onClick={onClick}
      isDisabled={isDisabled}
    >
      {children}
    </IconButton>
  );
};
