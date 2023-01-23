import React, { useEffect } from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Checkbox,
  TablePagination
} from "@material-ui/core";

export default function TableComponent({ rows, column, tableStyle, tableTotal, search }) {

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

  useEffect(function(){
    if(search && search !== ""){
      setPage(0);
    }
  }, [search])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (<>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={rows.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
    <Table style={tableStyle}>
      <TableHead>
        <TableRow hover role="checkbox">
          {column.map(column => {
            <TableCell>
              <Checkbox />
            </TableCell>
            return (
              <TableCell key={column}>{column}</TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)}
        {tableTotal}
      </TableBody>
    </Table>
  </>
  );
}