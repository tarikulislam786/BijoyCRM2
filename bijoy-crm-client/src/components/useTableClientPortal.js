import React, { Component, useEffect, useState } from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  TablePagination,

  TableSortLabel,
  Toolbar,
  IconButton,
  Tooltip,
  Switch,

} from "@material-ui/core";
import {DeleteIcon,FilterListIcon} from '@material-ui/icons';

import axios from "axios";
import ClientPortal from "../pages/ClientPortals/ClientPortal";

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(3),
    "& thead th": {
      fontweight: "600",
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
    },
    "& tbody td": {
      fontweight: "300",
    },
    "& tbody tr:hover": {
      backgroundColor: "#fffbf2",
      cursor: "pointer",
    },
  },
}));
export default function useTable(Data, headCells, filterFn) {
  // const classes = useStyles();

  const pages = [10, 20, 30];
  const [page, setPage] = useState(0);
  const [cpData, setClientPortals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const[order, setOrder] = useState();
  const[orderBy, setOrderBy] = useState();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    const fetchClientPortals = async () => {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/clientportals");
      setClientPortals(res.data);
      setLoading(false);
    };
    fetchClientPortals();
    // props.fetchAllServices();
  }, []); //DidMount stop the never ending loop
  // const recordsAfterPagingAndSorting = () => {
  //   return page.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // };
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el,index) => [el, index]);
    stabilizedThis.sort((a,b) => {
      const order = comparator(a[0], b[0]);
      if(order !== 0) return order;
      return a[1]-b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  function getComparator(order, orderBy) {
    return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
  }
  function descendingComparator(a, b, orderBy) {
    if(b[orderBy] < a[orderBy]) {
      return -1;
    }
    if(b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  const recordsAfterPagingAndSorting = () => {
    // Get Current Customers
    const IndexOfLastClientPortal = currentPage * rowsPerPage;
    const IndexOfFirstClientPortal = IndexOfLastClientPortal - rowsPerPage;
    const currentClientPortals = stableSort(filterFn.fn(cpData), getComparator(order, orderBy))
    .slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    return currentClientPortals;
  };
  const TblContainer = (props) => (
    //  classes = useStyles(),
    // <Table className= {classes.table}>
    <Table className={useStyles().table}>{props.children}</Table>
  );

  const TblHead = (props) => {
    const handleSortRequest = cellId =>{
      const isASC = orderBy === cellId && order === "asc";
      setOrder(isASC ? "desc" : "asc");
      setOrderBy(cellId);
    }
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell key={headCell.id} 
            sortDirection={orderBy === headCell.id ? order:false}>
              {headCell.disableSorting?headCell.label :
                <TableSortLabel active = {orderBy === headCell.id} direction = {orderBy === headCell.id ? order:"asc"} onClick={() => {handleSortRequest(headCell.id)}}>
                  {headCell.label}
                </TableSortLabel>
              }
              </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const TblPagination = () => (
    <TablePagination
      component="div"
      page={page}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      count={cpData.length}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  };
}
