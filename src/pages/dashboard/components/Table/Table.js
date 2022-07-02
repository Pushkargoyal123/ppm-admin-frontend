import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Checkbox
} from "@material-ui/core";

export default function TableComponent({ rows, column, tableStyle }) {

  return (
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
      </TableBody>
    </Table>
  );
}