import { Box, Button, Flex, Grid, Icon, Text } from "@chakra-ui/react";
import React from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp
} from "react-feather";
import {
  Column,
  Row, useFilters,
  useGlobalFilter, usePagination,
  useSortBy,
  useTable
} from "react-table";
import Card from "../Card";
import BottomSection from "../Card/CardFooter";
import TopSection from "../Card/CardHeader";
import { fuzzyTextFilterFn, GlobalFilter } from "./filter";
// import { fuzzyTextFilterFn, GlobalFilter } from "./filter";
import {
  StyledTable,
  TableCell,
  TableHead,
  TableIconButton,
  TableRow
} from "./styles";

type TableProps<D extends object = {}> = {
  data: any;
  pageSize?: number;
  tableHeading?: React.ReactNode;
  columns: Column<D>[];
  onRowClick?: (row: Row<D>) => void;
  getRowId?: (row: Row<D>) => any;
  canFilter?: boolean;
  searchBar?: boolean;
  pagination?: boolean;
  moreButton?: JSX.Element;
};

const Table = <D extends {}>({
  columns,
  data,
  tableHeading,
  pageSize: initialPageSize,
  onRowClick,
  getRowId,
  canFilter,
  searchBar = true,
  pagination = true,
  moreButton = null,
}: TableProps<D>): JSX.Element => {
  const [showFilters, setShowFilters] = React.useState(false);
  const tableColumns = React.useMemo(() => columns, [columns]);
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, globalFilter },
  } = useTable<D>(
    {
      columns: tableColumns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
      filterTypes,
      globalFilter: "fuzzyText",
      getRowId,
      // defaultColumn,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  const pageNr = pageIndex + 1;
  const pagesNr = pageOptions.length;

  return (
    <Card
      flexDirection="column"
      flex={{ base: "none", md: 1 }}
      width={{ base: "100%", md: "auto" }}
    >
      {canFilter && (
        <>
          <Button
            size="sm"
            variant="unstyled"
            borderRadius="0"
            outline="none"
            boxShadow="none"
            textAlign="left"
            width="100px"
            mb={5}
            onClick={() => setShowFilters(!showFilters)}
          >
            {t("filters")}
            <Icon as={showFilters ? ChevronUp : ChevronDown} size={20} ml={2} />
          </Button>
          {showFilters && (
            <Grid templateColumns="repeat(4, 1fr)" mb={5} gap={5}>
              {headerGroups.map((headerGroup) =>
                headerGroup.headers.map((column) => {
                  if (!column.Filter) return;
                  return (
                    <Box key={column.id}>
                      <Text fontWeight="bold" mb="5px">
                        {column.render("Header")}
                      </Text>
                      {column.canFilter ? column.render("Filter") : null}
                    </Box>
                  );
                })
              )}
            </Grid>
          )}
        </>
      )}
      {!!tableHeading && <TopSection>{tableHeading}</TopSection>}
      {searchBar && (
        <Flex flex={1} px={4} py={3} justifyContent="space-between">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Flex>
      )}
      <Box maxWidth="100%" width="100%" overflowX="auto">
        <StyledTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <Box
                key={headerGroup.id}
                display="table-row"
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <TableCell
                    px="15px"
                    py="10px"
                    key={column.id}
                    maxWidth={column.maxWidth}
                    {...column.getHeaderProps()}
                    justifyContent="space-between"
                    {...column.getSortByToggleProps({ title: undefined })}
                  >
                    <Flex justify="space-between">
                      <Text fontWeight="bold" color="gray.700">
                        {column.render("Header")}
                      </Text>
                      <Box w="15px" h="15px">
                        {column.isSorted && (
                          column.isSortedDesc ? (
                            <ChevronDown size={15} />
                          ) : (
                            <ChevronUp size={15} />
                          )
                        )}
                      </Box>
                    </Flex>
                  </TableCell>
                ))}
              </Box>
            ))}
          </TableHead>
          <Box display="table-row-group">
            {page.map(
              (row) =>
                // @ts-ignore
                prepareRow(row) || (
                  <TableRow
                    onClick={() => onRowClick && onRowClick(row)}
                    key={row.id}
                    display="table-row"
                    {...row.getRowProps()}
                    data-testid="table-row"
                  >
                    {row.cells.map((cell) => {
                      return (
                        <TableCell
                          key={cell.row.index}
                          justifyContent="flex-start"
                          px="15px"
                          py="10px"
                          maxWidth={cell.column.maxWidth}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )
            )}
          </Box>
        </StyledTable>
      </Box>
      <BottomSection justifyContent="flex-end" flexDirection="row">
        {!pagination && moreButton}
        {pagination && (
          <>
            <Flex flexDirection="row">
              <TableIconButton
                mx="2px"
                onClick={() => gotoPage(0)}
                isDisabled={!canPreviousPage}
                icon={<ChevronsLeft size={17} />}
              />
              <TableIconButton
                mx="2px"
                isDisabled={!canPreviousPage}
                onClick={() => previousPage()}
                icon={<ChevronLeft size={17} />}
              />
            </Flex>
            <Flex justifyContent="center" alignItems="center">
              <Text
                mx="7px"
                color="gray.500"
                fontSize="13px"
                textAlign="center"
                lineHeight="1.2"
              >

                  Stron {" "}
                  <strong>
                    { pageNr } z { pagesNr }
                  </strong>

              </Text>
            </Flex>
            <Flex flexDirection="row">
              <TableIconButton
                mx="2px"
                isDisabled={!canNextPage}
                onClick={() => nextPage()}
                icon={<ChevronRight size={17} />}
              />
              <TableIconButton
                mx="2px"
                onClick={() => gotoPage(pageCount ? pageCount - 1 : 1)}
                isDisabled={!canNextPage}
                icon={<ChevronsRight size={17} />}
              />
            </Flex>
          </>
        )}
      </BottomSection>
    </Card>
  );
};

export default React.memo(Table);

Table.defaultProps = {
  pageSize: 10,
};
