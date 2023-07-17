import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addAdminModalOpen, deleteModalOpen } from "../../../Store/Modal";
import { mutateAdmin } from "../../Admin/Admins";
interface IAdmins {
  admins: mutateAdmin[];
  handleRefetch: () => void;
}
const VerificationTable: React.FC<IAdmins> = ({ admins, handleRefetch }) => {
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Typography variant={"h6"} my={2}></Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Section</TableCell>
              <TableCell align="left">Username</TableCell>
              <TableCell align="left">Password</TableCell>
              <TableCell align="left">Delete</TableCell>
              <TableCell align="left">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.section}
                  </TableCell>
                  <TableCell align="left"> {row.email} </TableCell>
                  <TableCell align="left"> xxxxxxxxxxx </TableCell>
                  <TableCell align="left">
                    <DeleteOutline
                      className={"pointer"}
                      onClick={() =>
                        dispatch(deleteModalOpen({ id: row._id, type: false }))
                      }
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Edit
                      className={"pointer"}
                      onClick={() =>
                        dispatch(addAdminModalOpen({ id: row._id }))
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={admins.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default VerificationTable;
