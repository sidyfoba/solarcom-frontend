// // src/components/RenderForm.js

// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import axios from "axios";

// const RenderForm = ({ templateId }) => {
//   const [template, setTemplate] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTemplate = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/form-templates/${templateId}`
//         );
//         setTemplate(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load form template");
//         setLoading(false);
//       }
//     };

//     fetchTemplate();
//   }, [templateId]);

//   const handleChange = (e) => {
//     setFormValues({
//       ...formValues,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Values:", formValues);
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         {template.templateName}
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         {template.fields.map((field, index) => (
//           <Box key={index} sx={{ marginBottom: 2 }}>
//             {field.type === "String" && (
//               <TextField
//                 fullWidth
//                 label={field.name}
//                 name={field.name}
//                 value={formValues[field.name] || ""}
//                 onChange={handleChange}
//               />
//             )}
//             {field.type === "Number" && (
//               <TextField
//                 fullWidth
//                 type="number"
//                 label={field.name}
//                 name={field.name}
//                 value={formValues[field.name] || ""}
//                 onChange={handleChange}
//               />
//             )}
//             {field.type === "Date" && (
//               <TextField
//                 fullWidth
//                 type="date"
//                 label={field.name}
//                 name={field.name}
//                 InputLabelProps={{ shrink: true }}
//                 value={formValues[field.name] || ""}
//                 onChange={handleChange}
//               />
//             )}
//             {field.type === "Select" && (
//               <TextField
//                 fullWidth
//                 select
//                 label={field.name}
//                 name={field.name}
//                 value={formValues[field.name] || ""}
//                 onChange={handleChange}
//               >
//                 {field.options.map((option, idx) => (
//                   <MenuItem key={idx} value={option}>
//                     {option}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             )}
//           </Box>
//         ))}
//         <Button type="submit" variant="contained" color="primary">
//           Submit
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default RenderForm;
