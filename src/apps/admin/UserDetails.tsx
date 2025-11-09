import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Layout from "./Layout";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Props {
  roles: string[]; // Define the correct type for roles
}
const UserDetails = ({ roles }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        const response = await axios.get(
          `http://localhost:8080/api/us/user/${id}`,
          {
            headers: { Authorization: token },
          }
        ); // Adjust URL based on your backend
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleViewUploadCniFile = async (event) => {
    event.preventDefault(); // Prevent the default behavior of the event

    if (user.cniFileName != null && user.cniFileName.length !== 0) {
      try {
        // Example endpoint for fetching a PDF file
        const token = sessionStorage.getItem("jwt");
        const response = await axios.get(
          `http://localhost:8080/api/form/cni/file`,

          {
            responseType: "blob", // Specify the response type as blob
            headers: { Authorization: token },
          }
        );

        // Open the file in a new tab
        window.open(URL.createObjectURL(new Blob([response.data])), "_blank");
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    }
  };

  const handleViewUploadpapierLiberableFile = async (event) => {
    event.preventDefault(); // Prevent the default behavior of the event
    console.log("handleViewUploadpapierLiberableFile");
    if (
      user.justiceForm.papierLiberableFileName != null &&
      user.justiceForm.papierLiberableFileName.length !== 0
    ) {
      console.log("in the if ");
      try {
        console.log("in the if ");
        // Example endpoint for fetching a PDF file
        const token = sessionStorage.getItem("jwt");
        const response = await axios.get(
          `http://localhost:8080/api/justice/liberable/file`,

          {
            responseType: "blob", // Specify the response type as blob
            headers: { Authorization: token },
          }
        );

        // Open the file in a new tab
        window.open(URL.createObjectURL(new Blob([response.data])), "_blank");
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    }
  };

  const handleViewUploadCvFile = async (event) => {
    event.preventDefault(); // Prevent the default behavior of the event

    if (
      user.socialProfessionalForm.cvFileName != null &&
      user.socialProfessionalForm.cvFileName.length !== 0
    ) {
      try {
        // Example endpoint for fetching a PDF file
        const token = sessionStorage.getItem("jwt");
        const response = await axios.get(
          `http://localhost:8080/api/social/pro/cv/file`,

          {
            responseType: "blob", // Specify the response type as blob
            headers: { Authorization: token },
          }
        );
        // Open the file in a new tab
        window.open(URL.createObjectURL(new Blob([response.data])), "_blank");
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    }
  };

  if (!user)
    return (
      <Layout roles={roles}>
        <p>Loading...</p>
      </Layout>
    );

  return (
    <Layout roles={roles}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h5" align="center">
                Détails : {user.prenom} {user.nom}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle1">
                Informations personnelles
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Nom" secondary={user.prenom} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Prénom" secondary={user.nom} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Login" secondary={user.login} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Département"
                    secondary={user.departement}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Téléphone"
                    secondary={user.telephone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Date de Naissance"
                    secondary={user.dateNaissance}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Lieu Naissance"
                    secondary={user.lieuNaissance}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sexe" secondary={user.sexe} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Cni" secondary={user.cni} />
                </ListItem>
                <ListItem
                  secondaryAction={
                    user.cniFileName && (
                      <IconButton
                        edge="end"
                        aria-label="voir ficher"
                        onClick={(e) => handleViewUploadCniFile(e)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText
                    primary="Fichier cni"
                    // secondary={user.cniFileName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Téléphone 1"
                    secondary={user.telephone1}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Téléphone 2"
                    secondary={user.telephone2}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Adresse" secondary={user.adresse} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          {user.justiceForm && (
            <Grid item xs={12} sm={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1">Justice</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Date Arrestation"
                      secondary={user.justiceForm.dateArrestation}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Lieu Arrestation"
                      secondary={user.justiceForm.lieuArrestation}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Arrêté(e) par"
                      secondary={user.justiceForm.arrestePar}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Nom Poste Poilice ou Gendarmerie"
                      secondary={user.justiceForm.nomPoste}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Mandat de Dépôt"
                      secondary={user.justiceForm.mandatDepot}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Tribunal"
                      secondary={user.justiceForm.tribunal}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Cabinet"
                      secondary={user.justiceForm.cabinet}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Maison d'arrêt"
                      secondary={user.justiceForm.prison}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Bracelet Electronique"
                      secondary={user.justiceForm.braceletElectronique}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Date élargissement"
                      secondary={user.justiceForm.dateLiberte}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Jugé(e)"
                      secondary={user.justiceForm.jugeStatut}
                    />
                  </ListItem>
                  <ListItem
                    secondaryAction={
                      user.justiceForm.papierLiberableFileName && (
                        <IconButton
                          edge="end"
                          aria-label="voir fichier"
                          onClick={(e) =>
                            handleViewUploadpapierLiberableFile(e)
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary="Papier Liberable"
                      // secondary={user.justiceForm.papierLiberableFileName}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          )}
          {user.medicalForm && (
            <Grid item xs={12} sm={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1">Santé</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Symptômes particuliers"
                      secondary={user.medicalForm.symptoms}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Symptômes particuliers (Explication)"
                      secondary={user.medicalForm.symptomsDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Problèmes de vision ou d'audition"
                      secondary={user.medicalForm.vision}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Problèmes de vision ou d'audition (Explication)"
                      secondary={user.medicalForm.visionDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Problèmes de sommeil"
                      secondary={user.medicalForm.sleep}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Problèmes de sommeil (Explication)"
                      secondary={user.medicalForm.sleepDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Stressé(e) ou anxieux(se)"
                      secondary={user.medicalForm.anxiety}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Stressé(e) ou anxieux(se) (Explication)"
                      secondary={user.medicalForm.anxietyDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Changements d'humeur ou d'appétit"
                      secondary={user.medicalForm.humor}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Changements d'humeur ou d'appétit (Explication)"
                      secondary={user.medicalForm.humorDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Hospitalisé(e) durant ou après votre arrestation"
                      secondary={user.medicalForm.hospitalization}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Hospitalisé(e) durant ou après votre arrestation (Explication)"
                      secondary={user.medicalForm.hospitalizationDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Subi des interventions chirurgicales"
                      secondary={user.medicalForm.surgeries}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Subi des interventions chirurgicales (Explication)"
                      secondary={user.medicalForm.surgeriesDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Questions ou des inquiétudes particulières"
                      secondary={user.medicalForm.concerns}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Questions ou des inquiétudes particulières (Explication)"
                      secondary={user.medicalForm.concernsDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Autre dommage subi sur votre Santé"
                      secondary={user.medicalForm.otherDamage}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          )}
          {user.socialProfessionalForm && (
            <Grid item xs={12} sm={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  Sociale & Professionelle
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Difficultés de logement"
                      secondary={
                        user.socialProfessionalForm.difficultiesHousing
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Pourqoi (difficultés de logement)"
                      secondary={
                        user.socialProfessionalForm.difficultiesHousingDetails
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Residence actuel"
                      secondary={user.socialProfessionalForm.currentResidence}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Suivi social"
                      secondary={user.socialProfessionalForm.socialFollowUp}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Détails"
                      secondary={
                        user.socialProfessionalForm.socialFollowUpDetails
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Difficultés particulières dans votre vie quotidienne"
                      secondary={
                        user.socialProfessionalForm.difficultiesDailyLife
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Détails"
                      secondary={
                        user.socialProfessionalForm.difficultiesDailyLifeDetails
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Perdu un emploi a cause de votre arrestation"
                      secondary={user.socialProfessionalForm.lostJobDueToArrest}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Emploi perdu"
                      secondary={user.socialProfessionalForm.lostJob}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Pourquoi"
                      secondary={
                        user.socialProfessionalForm.lostJobDueToArrestWhy
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Un nouvel emploi"
                      secondary={user.socialProfessionalForm.newJob}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Nouvel emploi"
                      secondary={user.socialProfessionalForm.newJobName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Difficultés financières"
                      secondary={
                        user.socialProfessionalForm.financialDifficulties
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Détails"
                      secondary={
                        user.socialProfessionalForm.financialDifficultiesDetails
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Etudes / Formation"
                      secondary={user.socialProfessionalForm.studiesLevel}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Etudes arabe ou religieuse"
                      secondary={user.socialProfessionalForm.arabicStudies}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Niveau ou diplome"
                      secondary={
                        user.socialProfessionalForm.arabicStudiesDetails
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Dommages dans vos études ou formation"
                      secondary={user.socialProfessionalForm.damagesStudies}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Études / Fomration / Niveau"
                      secondary={
                        user.socialProfessionalForm.damagesStudiesLevel
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Détails"
                      secondary={
                        user.socialProfessionalForm.damagesStudiesDetails
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Suivez-vous une formation?"
                      secondary={user.socialProfessionalForm.followingTraining}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Détails"
                      secondary={
                        user.socialProfessionalForm.followingTrainingDetails
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Difficultés liee aux etudes ou formation"
                      secondary={
                        user.socialProfessionalForm.difficultiesStudies
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Détails"
                      secondary={
                        user.socialProfessionalForm.difficultiesStudiesDetails
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Compétences"
                      secondary={user.socialProfessionalForm.competencies}
                    />
                  </ListItem>
                  <ListItem
                    secondaryAction={
                      user.socialProfessionalForm.cvFileName && (
                        <IconButton
                          edge="end"
                          aria-label="voir fichier"
                          onClick={(e) => handleViewUploadCvFile(e)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary="CV"
                      // secondary={user.socialProfessionalForm.cvFileName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Type de besoin"
                      secondary={user.socialProfessionalForm.needsType}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Détails"
                      secondary={user.socialProfessionalForm.needsDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Domaine"
                      secondary={user.socialProfessionalForm.supportDomain}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Explication besoins"
                      secondary={user.socialProfessionalForm.supportDetails}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Autres Dommages subis"
                      secondary={user.socialProfessionalForm.otherDamages}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Layout>
  );
};

export default UserDetails;
