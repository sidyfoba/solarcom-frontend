import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Box } from "@mui/material";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        color="inherit"
        variant="outlined"
        onClick={() => handleLanguageChange("en")}
      >
        English
      </Button>
      <Button
        color="inherit"
        variant="outlined"
        onClick={() => handleLanguageChange("fr")}
      >
        Français
      </Button>
    </Box>
  );
};

export default LanguageSwitcher;
