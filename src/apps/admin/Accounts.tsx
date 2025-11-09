import VisibilityIcon from "@mui/icons-material/Visibility";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Box, Button, Grid, IconButton, Paper } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Layout from "./Layout";
import RoleDialog from "./RoleDialog";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useNavigate } from "react-router-dom";
import LoginPwdDialog from "./LoginPwdDialog";

interface User {
  id: string;
  login: string;
  email: string;
  password: string;
  name: string;
}
interface Props {
  roles: string[]; // Define the correct type for roles
}
export default function Accounts({ roles }: Props) {
  const navigate = useNavigate();
  const isAdmin = roles.length > 0 && roles.includes("ADMIN");
  const isDelegate = roles.length > 0 && roles.includes("DÉLÉGUÉ");

  const [rows, setRows] = useState<User[]>([]);
  // const [departementData, setDepartementData] = useState<
  //   { departement: string; count: number }[]
  // >([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openLoginDialog, setopenLoginDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const token = sessionStorage.getItem("jwt");
        const response = await axios.get<User[]>(
          "http://localhost:8080/users"
          // {
          //   headers: { Authorization: token },
          // }
        );
        setRows(response.data);
        console.log(response.data);
        // Calculate department counts
        const counts = response.data.reduce((acc, curr) => {
          const index = acc.findIndex(
            (item) => item.departement === curr.departement
          );
          if (index !== -1) {
            acc[index].count++;
          } else {
            acc.push({ departement: curr.departement, count: 1 });
          }
          return acc;
        }, [] as { departement: string; count: number }[]);

        // setDepartementData(counts);

        // Calculate total sign-up requests
        // setTotalUsers(response.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    const fileName = "users_data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, fileName);
  };

  const handleOpenDialog = (signUpRequest: User) => {
    setSelectedUser(signUpRequest);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleOpenLoginDialog = (signUpRequest: User) => {
    setSelectedUser(signUpRequest);
    setopenLoginDialog(true);
  };

  const handleCloseLoginDialog = () => {
    setSelectedUser(null);
    setopenLoginDialog(false);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    navigate(`/user/${user.id}`);
  };
  const handleAddUser = (user: User) => {
    // setSelectedUser(user);
    navigate("/admin/user");
  };
  // // Transform departementData for PieChart
  // const pieChartData = departementData.map((item) => ({
  //   name: item.departement,
  //   value: item.count,
  // }));

  const COLORS = [
    "#6baed6", // light blue
    "#fd8d3c", // light orange
    "#74c476", // light green
    "#e6550d", // light red-orange
    "#9e9ac8", // light purple
    "#a1d99b", // light green
    "#fdbe85", // light peach
    "#bcbddc", // light lavender
    "#8c6d31", // light olive
    "#637939", // light olive green
    "#fdae6b", // light orange
    "#1f78b4", // light blue
    "#b2df8a", // light green
    "#ff7f0e", // light orange
    "#33a02c", // light green
    "#a6cee3", // light blue
    "#fb9a99", // light pink
    "#e31a1c", // light red
    "#fdbf6f", // light peach
    "#ff7f00", // light orange
    "#cab2d6", // light lavender
    "#6a3d9a", // light purple
    "#ffff99", // light yellow
    "#b15928", // light brown
    "#fee08b", // light yellow
    "#d9d9d9", // light gray
    "#bc80bd", // light purple
    "#ccebc5", // light green
    "#ffed6f", // light yellow
    "#fccde5", // light pink
    "#ffffb3", // light yellow
    "#bebada", // light purple
    "#fb8072", // light salmon
    "#8dd3c7", // light turquoise
    "#80b1d3", // light sky blue
    "#fdb462", // light orange
    "#b3de69", // light lime green
    "#fccde5", // light pink
    "#d9d9d9", // light gray
    "#bc80bd", // light purple
    "#ccebc5", // light green
    "#ffed6f", // light yellow
    "#ff7f00", // light orange
    "#cab2d6", // light lavender
    "#fdbf6f", // light peach
  ];

  const columns: GridColDef[] = [
    {
      field: "viewDetails",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <IconButton
          size="small"
          onClick={() => handleViewDetails(params.row as User)}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      field: "edit",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <IconButton
          size="small"
          onClick={() => handleOpenDialog(params.row as User)}
        >
          <AssignmentIndIcon />
        </IconButton>
      ),
    },
    {
      field: "loginpwd",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <IconButton
          size="small"
          onClick={() => handleOpenLoginDialog(params.row as User)}
        >
          <VpnKeyIcon />
        </IconButton>
      ),
    },
    { field: "id", headerName: "ID", width: 90 },
    { field: "login", headerName: "Login", width: 150 },
    // { field: "nom", headerName: "Nom", width: 150 },
    // { field: "prenom", headerName: "Prénom", width: 150 },
    // { field: "telephone", headerName: "Téléphone", width: 150 },
    // { field: "roles", headerName: "Roles", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    // { field: "delegueDepartments", headerName: "Délégué de", width: 150 },
    // { field: "departement", headerName: "Département", width: 150 },
  ];

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              {/* <Typography variant="h6" align="center">
                Nombre Total d'inscrits : {totalUsers}
              </Typography> */}
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button variant="contained" onClick={handleAddUser}>
                Ajouter un utilisateur
              </Button>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" onClick={exportToExcel}>
                Export to Excel
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  checkboxSelection
                  disableSelectionOnClick
                />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <RoleDialog
        open={openDialog}
        onClose={handleCloseDialog}
        signUpRequest={selectedUser}
      />

      <LoginPwdDialog
        open={openLoginDialog}
        onClose={handleCloseLoginDialog}
        signUpRequest={selectedUser}
      />
    </Layout>
  );
}
