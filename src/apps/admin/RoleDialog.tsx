import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  FormHelperText,
  Box,
  Chip,
  Checkbox,
  FormControlLabel,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import axios from "axios";

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  signUpRequest: User | null;
}

interface User {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  login: string;
  password: string;
  departement: string;
  telephone: string;
  roles: string[]; // Array of roles
  delegueDepartments: string[]; // Array of delegated departments
}
const initialUser: User = {
  id: 0,
  prenom: "",
  nom: "",
  email: "",
  login: "",
  password: "",
  departement: "",
  telephone: "",
  roles: [],
  delegueDepartments: [],
};
const RoleDialog: React.FC<RoleDialogProps> = ({
  open,
  onClose,
  signUpRequest,
}) => {
  const [editedUser, setEditedUser] = useState<User>(initialUser);

  // const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  // const [passwordError, setPasswordError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([
    "ADMIN",
    "USER",
    "DÉLÉGUÉ",
    "DÉTENU",
  ]);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isDelegueRoleSelected, setIsDelegueRoleSelected] =
    useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (signUpRequest) {
      setEditedUser({ ...signUpRequest });
    }
  }, [signUpRequest]);

  const isEmailValid = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (editedUser) {
      const selectedRoles = event.target.value as string[];
      setEditedUser({ ...editedUser, roles: selectedRoles });

      // Check if "delegue" role is selected
      setIsDelegueRoleSelected(selectedRoles.includes("DÉLÉGUÉ"));
    }
  };

  // const handlePasswordChange = (password: string) => {
  //   if (editedUser) {
  //     setEditedUser({ ...editedUser, password });
  //   }
  // };

  // const handlePasswordConfirmationChange = (password: string) => {
  //   setPasswordConfirmation(password);
  // };

  const handleSaveChanges = async () => {
    // if (editedUser && passwordConfirmation === editedUser.password) {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("roles", editedUser.roles);
      formDataToSend.append(
        "delegueDepartments",
        editedUser.delegueDepartments
      );

      console.log("formDataToSend");
      console.log(formDataToSend);
      const token = sessionStorage.getItem("jwt");
      await axios.put(
        `http://localhost:8080/api/us/users/${editedUser.id}`,
        formDataToSend,
        {
          headers: { Authorization: token },
        }
      );
      setSnackbarSeverity("success");
      setSnackbarMessage("Utilisateur mis à jour avec succès !");
      setIsSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Error updating user data:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la mise à jour de l'utilisateur");
      setIsSnackbarOpen(true);
    }
    // } else {
    //   setPasswordError(true);
    // }
  };

  const handleClose = () => {
    onClose();
  };
  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  // const validateEmail = (email: string) => {
  //   if (isEmailValid(email)) {
  //     setEditedUser({ ...editedUser!, email });
  //     setEmailError(false);
  //   } else {
  //     setEmailError(true);
  //   }
  // };

  if (!editedUser) return null;

  const departments: string[] = [
    "Dakar",
    "Guédiawaye",
    "Pikine",
    "Keur Massar",
    "Rufisque",
    "Bambey",
    "Diourbel",
    "Mbacké",
    "Fatick",
    "Foundiougne",
    "Gossas",
    "Birkilane",
    "Kaffrine",
    "Koungheul",
    "Guinguinéo",
    "Kaolack",
    "Nioro du Rip",
    "Kédougou",
    "Salemata",
    "Saraya",
    "Kolda",
    "Médina Yoro Foulah",
    "Vélingara",
    "Kébémer",
    "Linguère",
    "Louga",
    "Kanel",
    "Matam",
    "Ranérou Ferlo",
    "Dagana",
    "Podor",
    "Saint-Louis",
    "Bounkiling",
    "Goudomp",
    "Sédhiou",
    "Bakel",
    "Goudiry",
    "Koumpentoum",
    "Tambacounda",
    "M'bour",
    "Thiès",
    "Tivaouane",
    "Bignona",
    "Oussouye",
    "Ziguinchor",
  ];

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Modifier ROLES de l'utilisateur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEditable}
                    onChange={(e) => setIsEditable(e.target.checked)}
                    color="primary"
                  />
                }
                label="Modifier"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                label="Prénom"
                fullWidth
                value={editedUser.prenom}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                label="Nom"
                fullWidth
                value={editedUser.nom}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                label="Email"
                fullWidth
                value={editedUser.email}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                label="Login"
                fullWidth
                value={editedUser.login}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                label="Téléphone"
                fullWidth
                value={editedUser.telephone}
              />
            </Grid>
            {/* <Grid item xs={12}>
            <TextField
              margin="normal"
              label="Mot de passe"
              type="password"
              fullWidth
              value={editedUser.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              disabled={!isEditable}
            />
          </Grid> */}
            {/* <Grid item xs={12}>
            <TextField
              margin="normal"
              label="Confirmer le mot de passe"
              type="password"
              fullWidth
              value={passwordConfirmation}
              error={passwordError}
              onChange={(e) => {
                handlePasswordConfirmationChange(e.target.value);
                setPasswordError(false);
              }}
              disabled={!isEditable}
            />
            {passwordError && (
              <FormHelperText error>
                Les mots de passe ne correspondent pas
              </FormHelperText>
            )}
          </Grid> */}
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">Rôles</InputLabel>
                <Select
                  labelId="role-select-label"
                  label="Rôles"
                  multiple
                  value={editedUser.roles || []}
                  onChange={handleRoleChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  disabled={!isEditable}
                >
                  {availableRoles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="department-select-label">
                  Départements délégués
                </InputLabel>
                <Select
                  labelId="department-select-label"
                  label="Délégués Départements"
                  multiple
                  value={editedUser.delegueDepartments || []}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      delegueDepartments: e.target.value as string[],
                    })
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  disabled={!isEditable || !isDelegueRoleSelected} // Disable if not editable or delegue role not selected
                >
                  {departments.map((department) => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
              Fermer
            </Button>
          }
          severity={snackbarSeverity}
        />
      </Snackbar>
    </>
  );
};

export default RoleDialog;
