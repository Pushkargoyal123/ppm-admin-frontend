import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Checkbox,
  TablePagination
} from "@material-ui/core";

export default function TableComponent({ rows, column, tableStyle, tableTotal }) {

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (<>
    <Table style={tableStyle}>
      <TableHead>
        <TableRow hover role="checkbox">
          {column.map(column => {
            <TableCell>
              <Checkbox />
            </TableCell>
            return (
              <TableCell>{column}</TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows}
        {tableTotal}
      </TableBody>
    </Table>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={rows.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </>
  );
}