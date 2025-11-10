// EmployeeDataGrid.tsx
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import Layout from "../Layout";
import { Box, Paper, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: string; // Date of Birth
  emergencyContacts: string;
  socialSecurityNumber: string;
}

const EmployeesList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Employee[]>(
          `${import.meta.env.VITE_API_BASE}/api/hr/employee/all`
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    // Logic for editing an employee
    // console.log("Editing employee:", employee);
    navigate(`/edit-employee/${id}`);
    // You might want to open a modal with a form pre-filled with employee data
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/hr/employee/${id}`
      );
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEdit(params.row.id)}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(params.row.id)}
          />
        </>
      ),
    },
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "dob", headerName: "Date of Birth", width: 150 },
    {
      field: "emergencyContacts",
      headerName: "Emergency Contacts",
      width: 150,
    },
    {
      field: "socialSecurityNumber",
      headerName: "Social Security Number",
      width: 120,
    },
    //employee details
    {
      field: "jobTitle",
      headerName: "Job Title",
      width: 120,
    },
    {
      field: "department",
      headerName: "Department",
      width: 120,
    },
    {
      field: "employeeID",
      headerName: "Employee ID",
      width: 120,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 120,
    },
    {
      field: "employmentStatus",
      headerName: "Employment Status",
      width: 120,
    },
    {
      field: "workSchedule",
      headerName: "Work Schedule",
      width: 120,
    },
  ];

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={employees}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
          </div>
        </Paper>
      </Box>
    </Layout>
  );
};

export default EmployeesList;
