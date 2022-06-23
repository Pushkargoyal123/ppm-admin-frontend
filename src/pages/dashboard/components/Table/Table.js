import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@material-ui/core";

export default function TableComponent({ rows, column, tableStyle }) {

  return (
    <Table style={tableStyle}>
      <TableHead>
        <TableRow>
          {column.map(column => {
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